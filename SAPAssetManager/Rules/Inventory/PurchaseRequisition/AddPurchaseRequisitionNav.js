import CommonLibrary from '../../Common/Library/CommonLibrary';
import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import Logger from '../../Log/Logger';

export default function AddPurchaseRequisitionNav(context) {
    //Set the global TransactionType variable to CREATE
    CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');

    PurchaseRequisitionLibrary.clearFlags(context);
    return PurchaseRequisitionLibrary.createAndStoreLocalHeaderId(context).then(function() {
        return PurchaseRequisitionLibrary.createAndStoreLocalItemId(context).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreateNav.action');
        });
    }).catch((error) => {
        Logger.error('PurchaseRequisition', `failed to open the page: ${error}`);
    });
}
