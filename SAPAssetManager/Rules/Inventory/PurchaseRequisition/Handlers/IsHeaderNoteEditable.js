import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function IsHeaderNoteEditable(context) {
    return PurchaseRequisitionLibrary.isAddAnother(context) !== true;
}
