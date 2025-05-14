import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function CreatItemsCaption(context) {
    let purchaseReqNo = PurchaseRequisitionLibrary.getLocalHeaderId(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', `PurchaseRequisitionHeaders('${purchaseReqNo}')`, [], '$expand=PurchaseRequisitionItem_Nav').then(result => {
        let count = 0;
        if (result && result.length > 0) {
            count = result.getItem(0).PurchaseRequisitionItem_Nav.length;
        }
        return context.localizeText('items_list_count', [count]);
    });
}
