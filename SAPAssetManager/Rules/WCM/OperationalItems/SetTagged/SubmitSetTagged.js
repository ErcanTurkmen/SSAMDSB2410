import IsWCMSignatureEnabled from '../SignatureAttachment/IsWCMSignatureEnabled';
import DocumentCreateDelete from '../../../Documents/Create/DocumentCreateDelete';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import { TagStates } from '../Details/OperationItemToolBarCaption';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { OpItemMobileStatusCodes } from '../libWCMDocumentItem';
import { AddCurrentMobileStatusToHistory, SetCertificateMobileStatus, SetCurrentMobileStatus } from '../../SafetyCertificates/SetRevokePrepared/SetRevokePreparedAction';
import { WCMCertificateMobileStatuses } from '../../SafetyCertificates/SafetyCertificatesLibrary';

export const TaggingStateMap = Object.freeze({
    [TagStates.SetTagged]: SubmitSetTagged,
    [TagStates.SetUntagged]: SubmitSetUntagged,
});

export const ConfirmMessageMap = Object.freeze({
    [TagStates.SetTagged]: 'tag_item_confirmation_text',
    [TagStates.SetUntagged]: 'untag_item_confirmation_text',
});

export const SuccessToastMessageMap = Object.freeze({
    [TagStates.SetTagged]: 'item_tagged_success_message',
    [TagStates.SetUntagged]: 'item_untagged_success_message',
});

/**
 * @param {IClientAPI & {binding: WCMDocumentItem}} context */
export default async function SubmitSetTagged(context) {
    return Promise.all([
        UpdateLockNumber(context),
        UpdateMobileStatusToTagged(context),
        IsWCMSignatureEnabled(context) ? context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SignatureAttachment/SignatureControlCreateSignature.action') : Promise.resolve(),
        CreateAttachments(context),
    ])
        .then(() => context.read('/SAPAssetManager/Services/AssetManager.service', `WCMDocumentHeaders('${context.binding.WCMDocument}')`, [], '$expand=PMMobileStatus,WCMDocumentItems,WCMDocumentItems/PMMobileStatus'))
        .then((/** @type {ObservableArray<WCMDocumentHeader} */ result) => {
            if (ValidationLibrary.evalIsEmpty(result)) {
                return false;
            }
            const certificate = result.getItem(0);
            if (certificate.WCMDocumentItems.every(item => item.PMMobileStatus?.MobileStatus === OpItemMobileStatusCodes.Tagged)) {  // all opitems are tagged
                return SetCertificateMobileStatus(context, certificate, WCMCertificateMobileStatuses.Tagged);
            }
            return false;
        })
        .catch(error => {
            Logger.error('Set Tagged failed', error);
            throw error;
        });
}

export function SubmitSetUntagged(context) {
    return Promise.all([
        UpdateLockNumber(context),
        UpdateMobileStatusToUntagged(context),
        IsWCMSignatureEnabled(context) ? context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SignatureAttachment/SignatureControlCreateSignature.action') : Promise.resolve(),
        CreateAttachments(context),
    ])
        .then(() => context.read('/SAPAssetManager/Services/AssetManager.service', `WCMDocumentHeaders('${context.binding.WCMDocument}')`, [], '$expand=PMMobileStatus,WCMDocumentItems,WCMDocumentItems/PMMobileStatus'))
        .then((/** @type {ObservableArray<WCMDocumentHeader} */ result) => {
            if (ValidationLibrary.evalIsEmpty(result)) {
                return false;
            }
            const certificate = result.getItem(0);
            if (certificate.WCMDocumentItems.every(item => item.PMMobileStatus?.MobileStatus === OpItemMobileStatusCodes.UnTagged)) {  // all opitems are untagged
                return SetCertificateMobileStatus(context, certificate, WCMCertificateMobileStatuses.Untagged);
            }
            return false;
        })
        .catch(error => {
            Logger.error('Set Unagged failed', error);
            throw error;
        });
}

export function UpdateMobileStatusToTagged(context) {
    return UpdateMobileStatusToStatus(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue());
}
export function UpdateMobileStatusToUntagged(context) {
    return UpdateMobileStatusToStatus(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntaggedParameterName.global').getValue());
}

/** @param {IClientAPI & {binding: WCMDocumentItem}} context  */
function UpdateMobileStatusToStatus(context, statusName) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WCMDocumentItem.global').getValue();
    return AddCurrentMobileStatusToHistory(context, context.binding)
        .then(() => SetCurrentMobileStatus(context, context.binding, statusName, objectType));
}

export function CreateAttachments(context) {
    CommonLibrary.setStateVariable(context, 'skipToastAndClosePageOnDocumentCreate', true);
    return DocumentCreateDelete(context);
}

export function UpdateLockNumber(context) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemUpdate.action',
        'Properties': {
            'Properties': {
                'LockNumber': '#Control:LockNumber/#Value',
            },
        },
    });
}

export function SubmitTagConfirmDialog(context, message) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/SetTaggedConfirmDialog.action',
        'Properties': {
            'Message': message,
        },
    }).then(actionResult => {
        if (actionResult.data === false) {
            throw Error('cancelled');
        }
    });
}

export function SubmitTagSuccessToasMessage(context, message) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/ItemsSubmittedToast.action',
        'Properties': {
            'Message': message,
        },
    });
}
