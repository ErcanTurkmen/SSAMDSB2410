
export default function QuotationItemsByObjectIDCount(context) {
    let pageProxy = context.getPageProxy();
    return pageProxy.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotationItems', `$filter=ObjectID eq '${pageProxy.binding.ObjectID}'`);
}
