/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function AppVersionInfo(clientAPI) {
    return clientAPI.getVersionInfo()['Application Version'];
}
