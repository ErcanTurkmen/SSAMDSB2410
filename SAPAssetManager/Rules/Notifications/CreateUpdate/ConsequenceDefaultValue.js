import {CompareReadLink} from '../../Common/Library/ReadLinkUtils';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ConsequenceDefaultValue(context) {
    let emp = context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP;

    if (emp) {
        for (let key in emp) {
            if (CompareReadLink(key, context.binding['@odata.readLink'])) {
                return context.getPageProxy().evaluateTargetPathForAPI('#Page:NotificationAddPage').getClientData().EMP[key].Consequence;
            }
        }
    }
    return '';
}
