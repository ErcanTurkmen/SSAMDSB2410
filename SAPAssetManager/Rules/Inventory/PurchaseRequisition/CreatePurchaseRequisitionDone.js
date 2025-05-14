import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';

export default function CreatePurchaseRequisitionDone(context) {
    PurchaseRequisitionLibrary.clearFlags(context);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreatedSuccessfully.action');
}
