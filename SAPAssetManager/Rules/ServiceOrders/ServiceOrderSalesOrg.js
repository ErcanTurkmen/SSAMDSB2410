export default async function ServiceOrderSalesOrg(clientAPI, serviceObjectId) {
    const binding = clientAPI.binding || {};

    if (serviceObjectId || binding.ObjectID) {
        const query = `$filter=ObjectID eq '${serviceObjectId || binding.ObjectID}'`;
        const entitySet = binding['@odata.type'] === '#sap_mobile.S4ServiceQuotationItem' ? 'S4ServiceQuotations' : 'S4ServiceOrders';
        
        const serviceObject = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', entitySet, ['SalesOrg'], query).then(result => result.length ? result.getItem(0) : {});
        return serviceObject.SalesOrg || '';
    }

    return Promise.resolve('');
}
