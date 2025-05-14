import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetDesiredVendor(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'DesiredSupplierLstPicker');
}
