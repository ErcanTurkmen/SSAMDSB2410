import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function IsESRINameUserAuthEnabled(clientAPI) {
    let namedUserAuth = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ESRI/NameUserAuth.global').getValue();
    return (ApplicationSettings.getString(clientAPI, namedUserAuth, '') === 'Y');
}
