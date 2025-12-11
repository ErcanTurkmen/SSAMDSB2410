import { ValueIfExists } from '../../../../SAPAssetManager/Rules/Common/Library/Formatter';
import common from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import checkDigitalSignatureState from '../../../../SAPAssetManager/Rules/DigitalSignature/CheckDigitalSignatureState';
import digitalSigLib from '../../../../SAPAssetManager/Rules/DigitalSignature/DigitalSignatureLibrary';
import userFeaturesLib from '../../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import IsOnlineNotification from '../../../../SAPAssetManager/Rules/OnlineSearch/Notifications/IsOnlineNotification';
import { NotificationProcessingContextType } from '../../../../SAPAssetManager/Rules/Notifications/EMP/CreateEMPEntries';

export default function NotificationDetailsHeaderFormat(context) {
    let binding = context.binding;
    let priority;
    let isLocal;
    switch (context.getProperty()) {
        case 'HeadlineText':
            return ValueIfExists(context.binding.NotificationDescription, '-');
        case 'BodyText':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/FunctionalLocation', [], '')
                .then(function (data) {
                    if (data.length > 0) {
                        const item = data.getItem(0);
                        return `${item.FuncLocId} - ${item.FuncLocDesc}`;
                    } else {
                        return '';
                    }
                });
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Equipment', [], '')
                .then(function (data) {
                    if (data.length > 0) {
                        const item = data.getItem(0);
                        return item.EquipDesc + ' (' + item.EquipId + ')';
                    } else {
                        return '';
                    }
                });
        case 'Subhead':
            return binding.NotificationNumber;
        case 'StatusImage':
            priority = binding.NotifPriority.Priority;
            isLocal = common.isCurrentReadLinkLocal(context.binding['@odata.readLink']);     //DSB customization to hide priority for local notificaiton
            if (!isLocal) {
                return common.shouldDisplayPriorityIcon(context, parseInt(priority));
            }
            else {
                return '';
            }
        case 'SubstatusText':
            priority = binding.NotifPriority;
            isLocal = common.isCurrentReadLinkLocal(context.binding['@odata.readLink']);     //DSB customization to hide priority for local notificaiton
            return ValueIfExists(priority, context.localizeText('none'), function (value) {
                if (isLocal) {
                    return "";
                }
                else {
                    return value.PriorityDescription;
                }
            });
        case 'Tags': {
            const tags = [];
            if (IsOnlineNotification(context)) {
                tags.push({
                    'Text': '$(L,viewing_online_content_only)',
                });
            }
            tags.push(context.getBindingObject().NotificationType);
            if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && Object.prototype.hasOwnProperty.call(context.getBindingObject(), 'QMCodeGroup')) {
                tags.push(context.getBindingObject().QMCodeGroup + context.getBindingObject().QMCode);
            }
            let mobileStatus = libMobile.getMobileStatus(binding, context);
            if (mobileStatus && mobileStatus !== '') {
                tags.push(context.localizeText(mobileStatus));
            }
            if (common.isDefined(binding.NotifProcessingContext)) {
                tags.push(context.localizeText(binding.NotifProcessingContext === NotificationProcessingContextType.MinorWork ? 'minor_work' : 'emergency_work'));
            }
            if (!IsOnlineNotification(context) && digitalSigLib.isDigitalSignatureEnabled(context)) {
                return checkDigitalSignatureState(context).then(function (state) {
                    if (state !== '') {
                        tags.push(context.localizeText('signed'));
                        return tags;
                    } else {
                        return tags;
                    }
                }).catch(() => {
                    return tags;
                });
            } else {
                return tags;
            }
        }
        default:
            return '';
    }
}
