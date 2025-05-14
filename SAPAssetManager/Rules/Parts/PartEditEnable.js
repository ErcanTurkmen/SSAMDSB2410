import libCom from '../Common/Library/CommonLibrary';

/**
* Determine if we can edit a part
*/
export default function PartEditEnable(context, customBinding) {
    let readLink = libCom.getTargetPathValue(context, '#Property:@odata.readLink');
    if (!readLink && customBinding) {
        readLink = customBinding['@odata.readLink'];
    }
    return libCom.isCurrentReadLinkLocal(readLink);
}
