
import libCommon from '../../Common/Library/CommonLibrary';

export default function PartDetailsAddButtonVisible(pageClientAPI) {
    let currentReadLink = libCommon.getTargetPathValue(pageClientAPI, '#Property:@odata.readLink');
    return !libCommon.isCurrentReadLinkLocal(currentReadLink);
}
