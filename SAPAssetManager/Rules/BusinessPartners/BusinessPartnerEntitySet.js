import Logger from '../Log/Logger';

export default function BusinessPartnerEntitySet(context) {

    if (typeof context.getPageProxy === 'function') {
        context = context.getPageProxy();
    }

    const entityReadLink = context.binding['@odata.readLink'];
    let entitySet = entityReadLink + '/Partners';

    const entityType = context.binding['@odata.type'];
    //BP nav-link for work order is WOPartners
    if (entityType === '#sap_mobile.MyWorkOrderHeader') {
        entitySet = entityReadLink + '/WOPartners';
    }

    if (entityType === '#sap_mobile.Equipment') {
        entitySet = entityReadLink + '/Partner';
    }

    if (entityType === '#sap_mobile.FunctionalLocation') {
        entitySet = entityReadLink + '/FuncLocPartner';
    }


    if (entityType === '#sap_mobile.S4ServiceOrder' ||
        entityType === '#sap_mobile.S4ServiceRequest' ||
        entityType === '#sap_mobile.S4ServiceItem' ||
        entityType === '#sap_mobile.S4ServiceConfirmation' ||
        entityType === '#sap_mobile.S4ServiceQuotation' ||
        entityType === '#sap_mobile.S4ServiceQuotationItem') {
        entitySet = entityReadLink + '/Partners_Nav';
    }

    if (entityType === '#sap_mobile.S4ServiceConfirmationItem') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], `$expand=TransHistories_Nav/S4ServiceConfirms_Nav&$filter=TransHistories_Nav/any(wp: (wp/S4ServiceConfirms_Nav/ObjectID eq '${context.binding.ObjectID}'))&$top=1`)
            .then(result => {
                if (result.length) {
                    return result.getItem(0)['@odata.readLink'] + '/Partners_Nav';
                } else {
                    return entityReadLink + '/S4ServiceConfirmation_Nav/Partners_Nav';
                }
            })
            .catch(error => {
                Logger.error('BusinessPartnerEntitySet', error);
                return Promise.resolve(entityReadLink + '/S4ServiceConfirmation_Nav/Partners_Nav');
            });
    }
    
    return Promise.resolve(entitySet);
}
