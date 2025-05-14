import libCom from '../Common/Library/CommonLibrary';
import libNetwork from '../Common/Library/NetworkMonitoringLibrary';
import Logger from '../Log/Logger';

/**
* Executes navigation to Online Search page with preselected tab if specified, 
* then caches entity sets to use later on page,
* then checks network state and displays error banner if user is offline
* @param {IClientAPI} context
*/
export default function ExecuteNavToOnlineSearchPage(context, tab = '') {
    return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/OnlineSearchNav.action').then(() => {
        setPreselectedTab(context, tab);
        return cacheEntitySetsForOnlineSearchPage(context).then(() => {
            if (!libNetwork.isNetworkConnected(context)) {
                return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/UserOfflineErrorBanner.action');
            }
            return null;
        });
    });
}

export function cacheEntitySetsForOnlineSearchPage(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:OnlineSearch').getClientData();
        return Promise.all([
            libCom.cacheEntity(context, 'Plants', '$select=Plant,PlantDescription', ['Plant'], ['Plant', 'PlantDescription'], clientData),
            libCom.cacheEntity(context, 'WorkCenters', '$select=WorkCenterId,ExternalWorkCenterId', ['WorkCenterId'], ['WorkCenterId', 'ExternalWorkCenterId'], clientData),
        ]);
    } catch (err) {
        Logger.error('cacheEntitySetsBeforeNavComplete', err);
        return Promise.resolve();
    }
}

function setPreselectedTab(context, tab) {
    //if preselected value is work orders tab, do not change tab manually as it is a default one anyway
    if (libCom.isDefined(tab) &&
        tab !== context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue()) {
        context.evaluateTargetPathForAPI('#Page:OnlineSearch').getControls()[0].setSelectedTabItemByName(tab);
    }
}
