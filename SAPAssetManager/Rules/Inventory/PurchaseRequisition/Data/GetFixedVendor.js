import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetFixedVendor(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'FixedVendorLstPicker');
}
