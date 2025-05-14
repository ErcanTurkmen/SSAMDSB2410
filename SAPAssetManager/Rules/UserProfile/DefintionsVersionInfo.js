/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function DefintionsVersionInfo(clientAPI) {
    return clientAPI.getVersionInfo()['Definitions Version'];

}
