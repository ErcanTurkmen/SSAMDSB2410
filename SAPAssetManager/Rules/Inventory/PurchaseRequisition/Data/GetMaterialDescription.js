import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetMaterialDescription(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'MaterialDescriptionSimple');
}
