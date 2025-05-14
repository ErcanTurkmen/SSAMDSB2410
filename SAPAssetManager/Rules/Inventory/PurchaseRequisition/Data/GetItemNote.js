import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetItemNote(context) {
    return PurchaseRequisitionLibrary.getControlValue(context, 'ItemNote');
}
