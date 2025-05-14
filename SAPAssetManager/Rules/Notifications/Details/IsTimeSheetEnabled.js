/**
* Show/hide create Time Sheet button based on user authorizations and component assignment
* @param {IClientAPI} context
*/
import deepLinkLibrary from '../../DeepLinks/DeepLinkLibrary';

export default function IsTimeSheetEnabled(context) {
    return deepLinkLibrary.CreateTimesheetAllowed(context);
}
