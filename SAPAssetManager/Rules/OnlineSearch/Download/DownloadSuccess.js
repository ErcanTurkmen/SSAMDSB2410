import libCom from '../../Common/Library/CommonLibrary';
import { cacheEntitySetsForOnlineSearchPage } from '../ExecuteNavToOnlineSearchPage';

/**
* Update list on download success
* @param {IClientAPI} context
*/
export default function DownloadSuccess(context) {
    const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
    onlineSearchPage.setActionBarItemVisible('SearchCriteria', true);
    libCom.removeStateVariable(context, 'OnlineSearchDownloadInProgress');
    libCom.clearFromClientData(context, ['MyEquipments', 'MyFunctionalLocations', 'MyWorkOrderHeaders', 'MyNotificationHeaders'], onlineSearchPage.getClientData());
    const actionBinding = context.getActionBinding() || context.binding;
    return cacheEntitySetsForOnlineSearchPage(context).then(() => {
        const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
        const sectionedTable = pageProxy.getControl('SectionedTable') || pageProxy.getControls()?.[0];
        const bindingEntityType = actionBinding['@odata.type'];
        if (bindingEntityType === '#sap_mobile.WorkOrderHeader' || bindingEntityType === '#sap_mobile.WorkOrderOperation' 
                || bindingEntityType === '#sap_mobile.WorkOrderSubOperation') {
            let redrawAction = Promise.resolve();
           
            if (sectionedTable) {
                redrawAction = sectionedTable.redraw();
            }

            return redrawAction.then(() => {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${actionBinding.OrderId}'`).then((order) => {
                    if (libCom.getPageName(context).includes('Details')) {
                        libCom.setStateVariable(context, 'UpdateOnlineListOnReturn', true);
                    }
                    if (!order.length) {
                        return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadFailed.action')
                        .then(() => Promise.reject());
                    }

                    if (sectionedTable) {
                        sectionedTable.redraw();
                        return Promise.resolve();
                    }

                    return Promise.resolve();
                }); 
            });
        } else {
            if (libCom.getPageName(context).includes('Details')) {
                libCom.setStateVariable(context, 'UpdateOnlineListOnReturn', true);
            }
            
            if (sectionedTable) {
                sectionedTable.redraw();
                return Promise.resolve();
            }

            return Promise.resolve();
        }
    });
}
