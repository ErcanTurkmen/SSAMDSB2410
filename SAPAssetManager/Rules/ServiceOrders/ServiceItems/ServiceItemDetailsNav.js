import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import S4ServiceLibrary from '../S4ServiceLibrary';
import { ServiceItemDetailsPageName } from './ServiceItemDetailsPageToOpen';

export default function ServiceItemDetailsNav(context) {
    let pageProxy = context._control?.constructor?.name === 'EditableDataTableCell' ? context.currentPage.context.clientAPI.getPageProxy() : context.getPageProxy();
    let actionBinding = context._control?.constructor?.name === 'EditableDataTableCell' ? context.binding : pageProxy.getActionBinding();
    let queryOptions = '$select=*,MobileStatus_Nav/*,Category1_Nav/CategoryName,Category2_Nav/CategoryName,Category3_Nav/CategoryName,Category4_Nav/CategoryName&$expand=MobileStatus_Nav/OverallStatusCfg_Nav,Category1_Nav,Category2_Nav,Category3_Nav,Category4_Nav,Product_Nav,ServiceType_Nav,TransHistories_Nav,TransHistories_Nav/S4ServiceContractItem_Nav/Contract_Nav,ServiceProfile_Nav,AccountingInd_Nav,S4ServiceErrorMessage_Nav';
       
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItems/ServiceItemDetailsNav.action');
        });
    });
}

function generateToolbarItems(pageProxy) {
    return S4ServiceLibrary.getAvailableStatusesServiceItem(pageProxy, pageProxy.getActionBinding()).then(items => {
        return DetailsPageToolbarClass.getInstance().saveToolbarItems(pageProxy, items, ServiceItemDetailsPageName(pageProxy)).then(() => {
            return Promise.resolve();
        });
    });
}
