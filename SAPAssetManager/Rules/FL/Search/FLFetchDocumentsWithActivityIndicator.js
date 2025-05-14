import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
import triggerOnlineSearch from './FLTriggerOnlineSearch';
import ODataLibrary from '../../OData/ODataLibrary';

/**
* 
* This function is similar to FLFetchDocumentsOnline, 
* but we use an activity indicator instead of the ProgressBanner. 
* This will prevent the user from clicking on the 'cancel' while the downloading of the documents is in progress
* 
*/
export default function FLFetchDocumentsWithActivityIndicator(context) {

    const downloadStarted = libCom.getStateVariable(context, 'DownloadFLDocsStarted');
    if (!downloadStarted) {
        context.showActivityIndicator(context.localizeText('initialize_online_service'));
        return ODataLibrary.initializeOnlineService(context).then(function() {
            context.evaluateTargetPathForAPI('#Page:FLOverviewPage').getClientData().Documents = [];
            libCom.setStateVariable(context, 'Documents', []);
            return triggerOnlineSearch(context).finally(() => {
                context.dismissActivityIndicator();
            });
        }).catch(function(err) {
            context.dismissActivityIndicator();
            libCom.setStateVariable(context, 'DownloadFLDocsStarted', false);
            Logger.error('InitializeOnlineService',`Failed to initialize Online OData Service: ${err}`);
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    }
    return Promise.resolve();
}
