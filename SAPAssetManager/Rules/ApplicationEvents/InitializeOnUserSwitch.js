/**
* Initialize action on User Switch
* @param {IClientAPI} context
*/
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import Logger from '../Log/Logger';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import LoadPersonaOverview from '../Persona/LoadPersonaOverview';

export default function InitializeOnUserSwitch(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then(() => {
        return context.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action').then(() => {
            ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', true);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Documents/DownloadOfflineOData.action',
                'Properties': {
                    'OnSuccess': '/SAPAssetManager/Rules/UserFeatures/ReadingOfflineUserFeatures.js',
                },
            });
        }).catch((error) => {
            handleInitializationError(context, error);
        }).finally(() => {
            LoadPersonaOverview(context);
        });
    }).catch((error) => {
        handleInitializationError(context, error);
    });
}

function handleInitializationError(context, error) {
    Logger.error('Initialize On User Switch Failed', error);
    // set to false to initialize ApplicationOnUserSwitch again in the DownloadActionsOrRulesSequence 
    // to resend parameters and requests to the backend to get the data from the second user
    ApplicationSettings.setBoolean(context, 'didUserSwitchDeltaCompleted', false);
    // set to true to initialize sync after failure in the DownloadActionsOrRulesSequence rule
    ApplicationSettings.setBoolean(context, 'initialSync', true); 
    // reset persona to show limited options on the side menu
    ApplicationSettings.setString(context, 'ActivePersona', '');
    // set to false to initialize sync in the ApplicationOnSync rule after user press sync button
    setSyncInProgressState(context, false);
}
