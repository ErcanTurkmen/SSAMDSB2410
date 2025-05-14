import CommonLibrary from '../../Common/Library/CommonLibrary';
import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import Logger from '../../Log/Logger';

export default function AddAnotherPurchaseRequisitionItemNav(context) {
	//Set the global TransactionType variable to CREATE
	CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
	PurchaseRequisitionLibrary.setAddAnotherFlag(context, true);
	PurchaseRequisitionLibrary.setCreateListPageFlag(context, false);

	return PurchaseRequisitionLibrary.createAndStoreLocalItemId(context).then(function() {
		let itemId = PurchaseRequisitionLibrary.getPreviousItemId(context);
		let headerId = PurchaseRequisitionLibrary.getLocalHeaderId(context);

		if (!itemId || !headerId) {
			return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreateNav.action');
		}

		return context.read('/SAPAssetManager/Services/AssetManager.service', `PurchaseRequisitionItems(PurchaseReqNo='${headerId}',PurchaseReqItemNo='${itemId}')`, [], '').then(result => {
			if (result && result.length) {
				let item = result.getItem(0);
				// material, batch, quantity must not be filled
				item.Material = '';
				item.ItemQuantity = '';
				item.Batch = '';
				item.ValuationPrice = '';
				item.Currency = '';
				context.getPageProxy().setActionBinding(item);
			}

			return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreateNav.action');
		});
	}).catch((error) => {
		Logger.error('PurchaseRequisitionItem', `failed to open the page: ${error}`);
	});
}
