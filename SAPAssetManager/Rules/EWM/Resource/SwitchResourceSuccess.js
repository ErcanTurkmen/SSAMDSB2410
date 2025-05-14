/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import DownloadResource from './DownloadResource';
export default function SwitchResourceSuccess(clientAPI) {
    clientAPI.executeAction('/SAPAssetManager/Actions/EWM/Resource/ReleaseSuccess.action');
    return DownloadResource(clientAPI);
}
