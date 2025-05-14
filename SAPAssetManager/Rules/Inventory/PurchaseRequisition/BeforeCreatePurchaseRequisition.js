import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function BeforeCreatePurchaseRequisition(context) {
    if (PurchaseRequisitionLibrary.mandatoryFieldsValid(context) && PurchaseRequisitionLibrary.fieldsLengthValid(context)) {
        if (CommonLibrary.IsOnCreate(context)) {
            if (PurchaseRequisitionLibrary.isAddAnother(context) || PurchaseRequisitionLibrary.isCreateFromDetailsPage(context)) {
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreatePurchaseRequisitionChangeSet.action');
            }
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreatePurchaseRequisitionHeader.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/CreatePurchaseRequisitionChangeSet.action');
            });
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/UpdatePurchaseRequisitionItem.action');
        }
    }

    return Promise.reject();
}
