import isWindows from '../Common/IsWindows';
import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';

/**
* Open the feedback survey
* @param {IClientAPI} context
*/
export default function Feedback(context) {
    return isWindows(context)? URLModuleLibrary.openUrl(context.getGlobalDefinition('/SAPAssetManager/Globals/Feedback/FeedbackURL.global').getValue()): context.executeAction('/SAPAssetManager/Actions/Feedback/FeedbackNav.action');
}
