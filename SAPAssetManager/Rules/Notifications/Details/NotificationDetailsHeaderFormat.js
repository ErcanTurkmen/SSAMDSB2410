import { ValueIfExists } from '../../Common/Library/Formatter';
import common from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import checkDigitalSignatureState from '../../DigitalSignature/CheckDigitalSignatureState';
import digitalSigLib from '../../DigitalSignature/DigitalSignatureLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import IsOnlineNotification from '../../OnlineSearch/Notifications/IsOnlineNotification';
import { NotificationProcessingContextType } from '../EMP/CreateEMPEntries';

export default function NotificationDetailsHeaderFormat(context) {
    let binding = context.binding;
    let priority;
    switch (context.getProperty()) {
        case 'HeadlineText':
            return ValueIfExists(context.binding.NotificationDescription, '-');
        case 'BodyText':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/FunctionalLocation', [], '')
                .then(function(data) {
                    if (data.length > 0) {
                        const item = data.getItem(0);
                        return `${item.FuncLocId} - ${item.FuncLocDesc}`;
                    } else {
                        return '';
                    }
                });
        case 'Footnote':
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Equipment', [], '')
                .then(function(data) {
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
            return common.shouldDisplayPriorityIcon(context,parseInt(priority));
        case 'SubstatusText':
            priority = binding.NotifPriority;
            return ValueIfExists(priority, context.localizeText('none'), function(value) {
                return value.PriorityDescription;
            });
        case 'Tags': {
            const tags = [];
            if (IsOnlineNotification(context)) {
                tags.push({
                    'Text': '$(L,viewing_online_content_only)',
                });
            }
            tags.push(context.getBindingObject().NotificationType);
            if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && Object.prototype.hasOwnProperty.call(context.getBindingObject(),'QMCodeGroup')) {
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
                return checkDigitalSignatureState(context).then(function(state) {
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
