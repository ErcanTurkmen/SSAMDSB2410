/**
* Cancel All Material Document Visible...
* @param {IClientAPI} context
*/

import libCom from '../../Common/Library/CommonLibrary';

export default function CancelAllMatDocVisible(context) {
    return !(libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']));
}
