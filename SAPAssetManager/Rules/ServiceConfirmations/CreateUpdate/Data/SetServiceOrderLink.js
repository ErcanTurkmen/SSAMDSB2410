
export default function SetServiceOrderLink(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return Promise.resolve(context.binding['@odata.readLink']);
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/S4ServiceOrder_Nav', [], '').then(result => {
            return result.getItem(0)['@odata.readLink'];
        });
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/TransHistories_Nav', [], '$expand=S4ServiceOrder_Nav').then(result => {
            return result.length && result.getItem(0).S4ServiceOrder_Nav? result.getItem(0).S4ServiceOrder_Nav['@odata.readLink'] : '';
        });
    }


    return Promise.resolve('');
}
