import CommonLibrary from '../../Common/Library/CommonLibrary';
import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import CreatePurchaseRequisitionItemRelatedItems from './CreatePurchaseRequisitionItemRelatedItems';

export default function AfterCreatePurchaseRequisition(context) {
    let isOnCreate = CommonLibrary.IsOnCreate(context); 
    let isCreateFromDetailsPage = PurchaseRequisitionLibrary.isCreateFromDetailsPage(context);
    let isAnotherCreate = PurchaseRequisitionLibrary.isAddAnother(context);
    CommonLibrary.setOnCreateUpdateFlag(context, '');
    
    if (isOnCreate) {
        PurchaseRequisitionLibrary.storePreviousItemId(context, PurchaseRequisitionLibrary.getLocalItemId(context));
        if (isAnotherCreate) {
            return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
        } else if (isCreateFromDetailsPage) {
            PurchaseRequisitionLibrary.clearFlags(context);
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreatedSuccessfully.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreateInventoryObject.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreateListNav.action');
            });
        }
    } else {
        return CreatePurchaseRequisitionItemRelatedItems(context).then(() => {
            if (isCreateFromDetailsPage) {
                PurchaseRequisitionLibrary.clearFlags(context);
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionItemUpdatedSuccessfully.action');
            }
            
            return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
        });
    }
}
