import CommonLibrary from '../../Common/Library/CommonLibrary';
import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import Logger from '../../Log/Logger';

export default function AddPurchaseRequisitionItemNav(context) {
	if (context && !context.binding) {
		return Promise.reject();
	}

	//Set the global TransactionType variable to CREATE
	CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
	PurchaseRequisitionLibrary.storeHeaderId(context, context.binding.PurchaseReqNo);
	PurchaseRequisitionLibrary.setDetailsPageFlag(context, true);
	
	return PurchaseRequisitionLibrary.createAndStoreLocalItemId(context).then(function() {
		return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreateNav.action');
	}).catch((error) => {
		Logger.error('PurchaseRequisitionItem', `failed to open the page: ${error}`);
	});
}
