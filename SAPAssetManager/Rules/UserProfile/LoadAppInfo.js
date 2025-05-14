/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function LoadAppInfo(clientAPI) {
    let versionInfo = clientAPI.getVersionInfo();
    let clientData = clientAPI.getAppClientData();
    clientData.ApplicationVersion = versionInfo['Application Version'];
    clientData.DefinitionsVersion = versionInfo['Definitions Version'];
    clientData.MDKVersion = versionInfo.SAPMDC;
}
