import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function ServiceQuotationItemDetailsNav(context) {
    const pageProxy = context.getPageProxy();
    const actionBinding = pageProxy.getActionBinding();
    const queryOptions = '$expand=MobileStatus_Nav,Product_Nav,TransHistories_Nav,S4ServiceErrorMessage_Nav';
    
    return CommonLibrary.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemDetailsNav.action', actionBinding['@odata.readLink'], queryOptions);
}
