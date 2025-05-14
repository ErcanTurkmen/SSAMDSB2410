import common from '../../Common/Library/CommonLibrary';

export default function ServiceContractCount(context) {
    const filter = context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem' ? 'S4ServiceContractItem_Nav': 'S4ServiceContract_Nav';
    return common.getEntitySetCount(context, context.binding['@odata.readLink'] + '/TransHistories_Nav', `$filter=sap.entityexists(${filter})`);
}
