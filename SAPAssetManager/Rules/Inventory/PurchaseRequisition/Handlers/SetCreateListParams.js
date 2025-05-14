import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function SetCreateListParams(context) {
    PurchaseRequisitionLibrary.setAddAnotherFlag(context, false);
    PurchaseRequisitionLibrary.setCreateListPageFlag(context, true);
}
