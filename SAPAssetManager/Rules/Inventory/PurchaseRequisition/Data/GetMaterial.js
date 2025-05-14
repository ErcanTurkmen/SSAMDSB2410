import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetMaterial(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'MaterialListPicker');
}
