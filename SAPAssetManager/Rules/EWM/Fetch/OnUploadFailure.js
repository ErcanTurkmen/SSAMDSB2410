import InitDefaultOverviewRows from '../../Confirmations/Init/InitDefaultOverviewRows';
import setSyncInProgressState from '../../Sync/SetSyncInProgressState';
import libCom from '../../Common/Library/CommonLibrary';
export default function OnUploadFailure(context) {
    setSyncInProgressState(context, false);
    libCom.setStateVariable(context, 'DownloadEWMDocsStarted', false);
    return InitDefaultOverviewRows(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
    });
}
