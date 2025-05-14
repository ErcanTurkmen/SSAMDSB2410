import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';

export default function ItemsQueryOptionsByHeaderId(context) {
    let purchaseReqNo = PurchaseRequisitionLibrary.getLocalHeaderId(context);
    return `$expand=PurchaseRequisitionLongText_Nav&$filter=PurchaseReqNo eq '${purchaseReqNo}'`;
}
