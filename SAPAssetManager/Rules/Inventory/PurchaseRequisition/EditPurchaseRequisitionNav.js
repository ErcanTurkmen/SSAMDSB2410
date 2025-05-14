import CommonLibrary from '../../Common/Library/CommonLibrary';
import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';

export default function EditPurchaseRequisitionNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');

    let binding = context.getPageProxy().getActionBinding() || context.binding;
    if (!binding || binding['@odata.type'] !== '#sap_mobile.PurchaseRequisitionItem') {
        return Promise.reject();
    }

    PurchaseRequisitionLibrary.storeHeaderId(context, binding.PurchaseReqNo);
    PurchaseRequisitionLibrary.storeItemId(context, binding.PurchaseReqItemNo);
    
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/PurchaseRequisitionCreateNav.action');
}
