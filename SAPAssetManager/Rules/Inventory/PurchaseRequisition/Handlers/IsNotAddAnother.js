import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function IsNotAddAnother(context) {
    return PurchaseRequisitionLibrary.isAddAnother(context) !== true
        && PurchaseRequisitionLibrary.isCreateListPage(context) !== true;
}
