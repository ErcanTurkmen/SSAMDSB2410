import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ItemAllowEdit(context) {
    let currentReadLink = CommonLibrary.getTargetPathValue(context, '#Property:@odata.readLink');
    return CommonLibrary.isCurrentReadLinkLocal(currentReadLink);
}
