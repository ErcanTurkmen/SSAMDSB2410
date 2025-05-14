import AttachedDocumentIcon from '../../../Documents/AttachedDocumentIcon';
import Logger from '../../../Log/Logger';
import { OpItemMobileStatusCodes } from '../libWCMDocumentItem';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import DocumentsBDSCount from '../../../Documents/Count/DocumentsBDSCount';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

/** @param {IClientAPI & {binding: WCMDocumentItem}} context  */
export default async function OperationalItemsIcons(context) {
    const icons = [];
    const binding = context.binding;

    if (ShowLockTaggedIcon(binding)) {
        icons.push('/SAPAssetManager/Images/locktagged.pdf');
    } else if (ShowLockUntaggedIcon(binding)) {
        icons.push('/SAPAssetManager/Images/lockuntagged.pdf');
    }

    const attachmentIcon = await DocumentsBDSCount(context, binding)
        .then(docsCount => AttachedDocumentIcon(context, undefined, docsCount))
        .catch((error) => {
            Logger.error(`Cannot read WCMDocumentItemAttachments for Operational Item ${binding['@odata.readLink']}`, error);
            return undefined;
        });
    if (attachmentIcon) {
        icons.push(attachmentIcon);
    }
    if (CommonLibrary.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
        icons.push(CommonLibrary.GetSyncIcon(context));
    }
    return icons;
}

function ShowLockTaggedIcon(wcmDocumentItem) {
    if (ValidationLibrary.evalIsEmpty(wcmDocumentItem.PMMobileStatus)) {
        return false;
    }
    const mobileStatus = wcmDocumentItem.PMMobileStatus.MobileStatus;
    return mobileStatus === OpItemMobileStatusCodes.Tagged || mobileStatus === OpItemMobileStatusCodes.Untag;
}

function ShowLockUntaggedIcon(wcmDocumentItem) {
    return wcmDocumentItem.PMMobileStatus && wcmDocumentItem.PMMobileStatus.MobileStatus === OpItemMobileStatusCodes.UnTagged;
}
