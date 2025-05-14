import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceQuotationDetailsNav(context) {
    const pageProxy = context.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    const queryOptions = '$expand=MobileStatus_Nav,Priority_Nav,S4ServiceErrorMessage_Nav';
    
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/ServiceQuotations/ServiceQuotationDetailsNav.action', actionBinding['@odata.readLink'], queryOptions);
}
