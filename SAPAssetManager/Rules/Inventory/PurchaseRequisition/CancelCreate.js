import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import ItemsQueryOptionsByHeaderId from './ItemsQueryOptionsByHeaderId';

export default function CancelCreate(context) {
	let itemQueryOptions = ItemsQueryOptionsByHeaderId(context);
	
	return context.read('/SAPAssetManager/Services/AssetManager.service', 'PurchaseRequisitionItems', [], itemQueryOptions).then(result => {
		let promises = [];
		if (result && result.length > 0) {
			for (let i = 0; i < result.length; i++) {
				promises.push(context.executeAction({
					'Name': '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/DeletePurchaseRuqisitionItem.action',
					'Properties': {
						'Target': {
							'ReadLink': result.getItem(i)['@odata.readLink'],
						},
					},
				}));
			}
		}

		return Promise.all(promises).then(() => {
			return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/DeletePurchaseRuqisitionHeader.action').then(() => {
				return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/DeleteInventoryObject.action').then(() => {
				PurchaseRequisitionLibrary.clearFlags(context);
					return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
				});
			});
		});	
	});
}
