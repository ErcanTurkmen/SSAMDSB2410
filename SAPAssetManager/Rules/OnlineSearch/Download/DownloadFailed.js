import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

/**
* Display error banner on download failed and reset flags/enable action bar items
* @param {IClientAPI} context
*/
export default function DownloadFailed(context) {
    try {
        libCom.removeStateVariable(context, 'OnlineSearchDownloadInProgress');
        const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
        onlineSearchPage.setActionBarItemVisible('SearchCriteria', true);

        if (libCom.getPageName(context).includes('Details')) {
            context.getPageProxy().setActionBarItemVisible('Download', true);
        }
    } catch (error) {
        Logger.error('DownloadFailed', error);
    }

    return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadFailed.action')
        .then(() => Promise.reject());
}
