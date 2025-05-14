import Logger from '../../Log/Logger';
import triggerOnlineSearch from './TriggerOnlineSearch';
import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function FetchDocumentsWithActivityIndicator(context) {
    let downloadStarted = libCom.getStateVariable(context, 'DownloadEWMDocsStarted');
    if (!downloadStarted) {
        context.showActivityIndicator(context.localizeText('initialize_online_service'));
        return ODataLibrary.initializeOnlineService(context).then(function() {
            context.evaluateTargetPathForAPI('#Page:EWMOverviewPage').getClientData().Documents = [];
            libCom.setStateVariable(context, 'Documents', []);
            return triggerOnlineSearch(context).finally(() => {
                context.dismissActivityIndicator();
            });
        }).catch(function(err) {
            context.dismissActivityIndicator();
            libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
            Logger.error(`Failed to initialize Online OData Service: ${err}`);
            return context.executeAction('/SAPAssetManager/Actions/SyncErrorBannerMessage.action');
        });
    }
    return Promise.resolve();
}
