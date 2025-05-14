import IsAndroid from '../Common/IsAndroid';
import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function LaunchAppStore(context) {
    if (IsAndroid(context)) {
        return URLModuleLibrary.openUrl(context.getGlobalDefinition('/SAPAssetManager/Globals/EPD/PlayStoreURL.global').getValue());
    }
    return URLModuleLibrary.openUrl(context.getGlobalDefinition('/SAPAssetManager/Globals/EPD/AppStoreURL.global').getValue());
}
