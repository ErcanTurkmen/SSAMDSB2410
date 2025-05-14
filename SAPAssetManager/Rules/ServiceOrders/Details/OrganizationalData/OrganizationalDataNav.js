import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function OrganizationalDataNav(context) {
    let readLink = context.binding['@odata.readLink'];
    let select = '$select=SalesRespOrg,SalesOrg,DistributionChannel,Division,ServiceOrg,ServiceRespOrg,ServiceOrg_Nav/ShortDescription,ServiceOrg_Nav/Description,SalesOrg_Nav/Description,SalesOrg_Nav/ShortDescription,ServiceRespOrg_Nav/Description,SalesRespOrg_Nav/Description,SalesRespOrg_Nav/ShortDescription';
    let expand = '$expand=ServiceOrg_Nav,SalesOrg_Nav,SalesRespOrg_Nav,ServiceRespOrg_Nav';

    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        select = '$select=SalesRespOrg,SalesOrg,S4ServiceOrder_Nav/DistributionChannel,S4ServiceOrder_Nav/Division,ServiceOrg,ServiceRespOrg,ServiceOrg_Nav/ShortDescription,ServiceOrg_Nav/Description,SalesOrg_Nav/Description,SalesOrg_Nav/ShortDescription,ServiceRespOrg_Nav/Description,SalesRespOrg_Nav/Description,SalesRespOrg_Nav/ShortDescription';
        expand = '$expand=ServiceOrg_Nav,SalesOrg_Nav,SalesRespOrg_Nav,ServiceRespOrg_Nav,S4ServiceOrder_Nav';
    }

    let queryOptions = select + '&' + expand;
    return CommonLibrary.navigateOnRead(context, '/SAPAssetManager/Actions/ServiceOrders/ServiceOrganizationalDataNav.action', readLink, queryOptions);
}
