import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetHeaderNote(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'HeaderNote');
}
