import libCom from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';

/**
* Start download of an online entity (equipment/floc)
* Show error toast message, if download is already in progress
* @param {IClientAPI} context
*/
export default function DownloadToDevice(context) {
    if (!libCom.getStateVariable(context, 'OnlineSearchDownloadInProgress')) {
        const activeTab = libSearch.getCurrentTabName(context);
        const workOrdersTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/WorkOrdersTab.global').getValue();

        disableActionsOnDownload(context);
        libCom.setStateVariable(context, 'OnlineSearchDownloadInProgress', true);

        // on WO tab should assign WO and then download
        if (activeTab === workOrdersTabName) {
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/AssignAndDownloadInProgress.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadInProgress.action');
        }
    }

    return context.executeAction('/SAPAssetManager/Actions/OnlineSearch/DownloadInProgressErrorDialog.action');
}

function disableActionsOnDownload(context) {
    if (libCom.getPageName(context).includes('Details')) {
        context.getPageProxy().setActionBarItemVisible('Assign', false);
    } else {
        const onlineSearchPage = context.evaluateTargetPathForAPI('#Page:OnlineSearch');
        onlineSearchPage.setActionBarItemVisible('SearchCriteria', false);
    }
}
