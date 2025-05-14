import Logger from '../../Log/Logger';

export default function ServiceContractDetailsNav(context) {
    const type = context.binding['@odata.type'];
    let filter = 'S4ServiceContract_Nav';
    let expand = '$expand=S4ServiceContract_Nav,S4ServiceContract_Nav/ContactPerson_Nav,S4ServiceContract_Nav/EmpResp_Nav,S4ServiceContract_Nav/Customer_Nav';
    if (type === '#sap_mobile.S4ServiceItem') {
        filter = 'S4ServiceContractItem_Nav';
        expand = '$expand=S4ServiceContractItem_Nav/Contract_Nav,S4ServiceContractItem_Nav/Contract_Nav/ContactPerson_Nav,S4ServiceContractItem_Nav/Contract_Nav/EmpResp_Nav,S4ServiceContractItem_Nav/Contract_Nav/Customer_Nav';
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/TransHistories_Nav', [], `$filter=sap.entityexists(${filter})&${expand}`).then(results => {
        if (results.length > 0) {
            if (type === '#sap_mobile.S4ServiceItem') {
                context.getPageProxy().setActionBinding(results.getItem(0).S4ServiceContractItem_Nav.Contract_Nav);
            } else {
                context.getPageProxy().setActionBinding(results.getItem(0).S4ServiceContract_Nav);
            }
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceContractDetailsNav.action');
        } else {
            return Promise.resolve();
        }
    }).catch(err => {
        Logger.error('SERVICE CONTRACT', err);
        return Promise.resolve();
    });
}
