import libCommon from '../Common/Library/CommonLibrary';

export default function ChecklistAllowDiscard(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);

    return isLocal;
}
