import Logger from '../../Log/Logger';
import triggerOnlineSearch from './TriggerOnlineSearch';
import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
/**
* 
* Fix for ICMTANGOAMF10-31418 - This function is similar to FetchDocumentsOnline, 
* but we use an activity indicator instead of the ProgressBanner. 
* This will prevent the user from clicking on the 'cancel' while the downloading of the documents is in progress
* 
*/
export default function FetchDocumentsWithActivityIndicator(context) {

    let downloadStarted = libCom.getStateVariable(context, 'DownloadIMDocsStarted');
    if (!downloadStarted) {
        context.showActivityIndicator(context.localizeText('initialize_online_service'));
        return ODataLibrary.initializeOnlineService(context).then(function() {
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents = [];
            return triggerOnlineSearch(context).finally(() => {
                context.dismissActivityIndicator();
            });
        }).catch(function(err) {
            context.dismissActivityIndicator();
            libCom.setStateVariable(context, 'DownloadIMDocsStarted', false);
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    }
    return Promise.resolve();
}
