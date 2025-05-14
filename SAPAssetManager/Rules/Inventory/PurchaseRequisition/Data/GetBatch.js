import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetBatch(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'MaterialBatch');
}
