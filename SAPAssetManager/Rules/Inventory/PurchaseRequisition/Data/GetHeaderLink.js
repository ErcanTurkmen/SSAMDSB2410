import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetHeaderLink(context) {
    let purchaseReqNo = PurchaseRequisitionLibrary.getLocalHeaderId(context);
    if (context.binding?.PurchaseReqNo) {
        purchaseReqNo = context.binding.PurchaseReqNo;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `PurchaseRequisitionHeaders('${purchaseReqNo}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0)['@odata.readLink'];
        }
        return '';
    });
}
