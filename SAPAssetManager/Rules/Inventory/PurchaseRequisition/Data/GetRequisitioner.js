import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetRequisitioner(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'RequestedBySimple');
}
