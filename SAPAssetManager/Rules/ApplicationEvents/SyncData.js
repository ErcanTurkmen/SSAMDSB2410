import DeleteUnusedOverviewEntities from '../Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import errorLibrary from '../Common/Library/ErrorLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';
import SDFIsFeatureEnabled from '../Forms/SDF/SDFIsFeatureEnabled';
import updateOnlineXSUAATokenEntity from '../Forms/SDF/updateOnlineXSUAATokenEntity';
import ODataLibrary from '../OData/ODataLibrary';

export default async function SyncData(clientAPI) {
    clientAPI.getClientData().Error='';
    setSyncInProgressState(clientAPI, true);
    libCom.removeStateVariable(clientAPI, 'isAnyWorkOrderStarted');

    if (SDFIsFeatureEnabled(clientAPI)) {
        appSettings.setBoolean(clientAPI, 'SDFCacheFlush', true);
        const success = await updateOnlineXSUAATokenEntity(clientAPI, '');
        if (!success) {
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(),`Failure to update xsuaa token: ${success}`);

            setSyncInProgressState(clientAPI, false);
            return false;
        }
    }

    if (!libCom.isInitialSync(clientAPI)) {
        //This is a delta sync
        return DeleteUnusedOverviewEntities(clientAPI).then(()=> {
            errorLibrary.clearError(clientAPI);
            appSettings.remove(clientAPI, 'LocallyIntalledEquip');
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then( ()=> {
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action').then(() => {
                    const deltaSyncConst = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/DeltaSync/DeltaSync.global').getValue();
                    const DownloadEffectedEntitiesConst = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/DeltaSync/DownloadEffectedEntities.global').getValue();
                    let param = libCom.getAppParam(clientAPI, deltaSyncConst, DownloadEffectedEntitiesConst);
                    if (!libVal.evalIsEmpty(param) && param === 'Y') {
                        let definingRequests = [];
                        return ODataLibrary.initializeOnlineService(clientAPI).then(function() {
                            return clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'ModifiedEntities', [], '').then(function(ModifiedEntityResults) {
                                if (ModifiedEntityResults && ModifiedEntityResults.length > 0) {
                                    for (let index = 0; index < ModifiedEntityResults.length; index++) {
                                        let entitysetName = ModifiedEntityResults.getItem(index).EntityName;
                                        definingRequests.push({
                                            'Name': entitysetName,
                                            'Query': entitysetName,
                                        });
                                    }
                                    return clientAPI.executeAction({'Name': '/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action', 'Properties': {
                                        'DefiningRequests': definingRequests,
                                    }});
                                }
                                setSyncInProgressState(clientAPI, false);
                                return clientAPI.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
                            }).catch((error) => {
                                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(),`SyncData(clientAPI) error: ${error}`);
                                setSyncInProgressState(clientAPI, false);
                            });
                        }).catch((error) => {
                            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(),`SyncData(clientAPI) error: ${error}`);
                            setSyncInProgressState(clientAPI, false);
                        });
                    }
                    return clientAPI.executeAction('/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action');
                });
            }).catch((error) => {
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(),`SyncData(clientAPI) error: ${error}`);
                setSyncInProgressState(clientAPI, false);
            });
        });
    }
    //This is an initial sync
    return clientAPI.getDefinitionValue('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js').then(()=>{
        setSyncInProgressState(clientAPI, false);
    });
}
