import ApplicationSettings from '../Common/Library/ApplicationSettings';
import InitializeOnUserSwitch from './InitializeOnUserSwitch';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import EsriLibrary from '../ESRI/EsriLibrary';

/**
* Function that executes when reset action is being called with Skip Reset set to true
* @param {IClientAPI} context
*/
export default function ApplicationOnUserSwitch(context) {
    context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName('OverviewBlank');
    let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
    let storeParameters = provider.getOfflineParameters();
    let headers = storeParameters.getCustomHeaders();
    if (headers) {
        headers.UserSwitch = true;
    } else {
        headers = {'UserSwitch':true};
    }
    storeParameters.setCustomHeaders(headers);
    ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', false);
    if (IsESRINameUserAuthEnabled(context)) {
        return EsriLibrary.callESRIAuthenticate(context, '/SAPAssetManager/Rules/ApplicationEvents/InitializeOnUserSwitch.js', true, true).finally(() => {
            return context.dismissActivityIndicator();
        });
    } else {
        context.showActivityIndicator(context.localizeText('download_progress'));
        return InitializeOnUserSwitch(context).finally(() => {
            context.dismissActivityIndicator();
        });
    }
}
