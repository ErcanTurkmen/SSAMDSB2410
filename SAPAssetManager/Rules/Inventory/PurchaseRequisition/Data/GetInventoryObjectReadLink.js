import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetInventoryObjectReadLink(context) {
    let purchaseReqNo = PurchaseRequisitionLibrary.getLocalHeaderId(context);
    let queryOptions = `$filter=ObjectType eq 'NB' and ObjectId eq '${purchaseReqNo}' and IMObject eq 'PR'`;
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyInventoryObjects', [], queryOptions).then(result => {
        if (result && result.length > 0) {
            return result.getItem(0)['@odata.editLink'];
        }
        return '';
    });
}
