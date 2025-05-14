/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import isAndroid from '../Common/IsAndroid';
import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';

export default function OpenSourceLink(clientAPI) {
    let url = '';
    if (isAndroid(clientAPI)) {
        url = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/OslnAndroid.global').getValue();
    } else {
        url = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/OslnIOS.global').getValue();
    }
    return URLModuleLibrary.openUrl(url);
}
