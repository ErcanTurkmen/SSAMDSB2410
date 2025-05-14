/**
* Show/hide create confirmation button based on user authorizations and component assignment
* @param {IClientAPI} context
*/
import deepLinkLibrary from '../../DeepLinks/DeepLinkLibrary';

export default function IsConfirmationEnabled(context) {
    return deepLinkLibrary.CreateConfirmationAllowed(context);
}
