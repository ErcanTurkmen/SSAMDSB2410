import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../../../ServiceOrders/S4ServiceLibrary';

export default async function GetServiceQuotationItemParentLink(context) {
    if (S4ServiceLibrary.isOnSQChangeset(context)) {
        return Promise.resolve('pending_1');
    }

    const serviceQuotationId = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceQuotationLstPkr'));
    
    if (serviceQuotationId) {
        const serviceQuotation = await context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceQuotations', [], `$filter=ObjectID eq '${serviceQuotationId}'`).then(result => result.length ? result.getItem(0) : {});
        return serviceQuotation['@odata.readLink'] || '';
    }

    return Promise.resolve('');
}
