import EsriLibrary from '../ESRI/EsriLibrary';
import IsESRINameUserAuthEnabled from '../ESRI/IsESRINameUserAuthEnabled';
import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function BeforeMapNav(clientAPI, openMapAction) {
    let actions = [];
    let applicationOnSync = false;
    if (IsESRINameUserAuthEnabled(clientAPI)) {
        if (ApplicationSettings.getBoolean(clientAPI, 'IsEsriLoginError', false)) {
            applicationOnSync = true;
            actions.push('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action');
        }
        actions.push(openMapAction);
        return EsriLibrary.callESRIAuthenticate(clientAPI, actions, false, applicationOnSync);
    }
    return clientAPI.executeAction(openMapAction);
}
