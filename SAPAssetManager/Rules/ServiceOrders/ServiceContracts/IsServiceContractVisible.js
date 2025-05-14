import Logger from '../../Log/Logger';

export default function IsServiceContractVisible(context) {
    const type = context.binding['@odata.type'];
    let filter = 'S4ServiceContract_Nav';
    let expand = '$expand=S4ServiceContract_Nav';
    if (type === '#sap_mobile.S4ServiceItem') {
        filter = 'S4ServiceContractItem_Nav';
        expand = '$expand=S4ServiceContractItem_Nav/Contract_Nav';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/TransHistories_Nav', [], `$filter=sap.entityexists(${filter})&${expand}`).then(results => {
        if (results.length > 0) {
            if (type === '#sap_mobile.S4ServiceItem') {
                return !!results.getItem(0).S4ServiceContractItem_Nav.Contract_Nav;
            } else {
                return !!results.getItem(0).S4ServiceContract_Nav;
            }
        }
        return false;
    }).catch(err => {
        Logger.error('SERVICE CONTRACT', err);
        return Promise.resolve();
    });
}
