import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import StatusUIGenerator from '../../MobileStatus/StatusUIGenerator';

export default function NotificationChangeStatusOptions(context, actionBinding) {
    return GetNotificationChangeStatusOptions(context, actionBinding).then(options => {
        return options.map(option => ({
            _Name: `${option.TransitionType}_${option.Status}`,
            _Type: 'FioriToolbarItem.Type.Button',
            Title: option.Title,
            OnPress: option.OnPress,
            ButtonType: StatusUIGenerator.getFioriToolbarButtonType(option.TransitionType),
            Semantic: StatusUIGenerator.getFioriToolbarButtonSemantic(option.TransitionType),
            Enabled: option.Enabled || true,
        }));
    });
}

export function GetNotificationChangeStatusOptions(context, binding = context.binding) {
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const onSuccessAction = '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusUpdateOnSuccess.js';

    const emergencyNotificationType = '01';
    if (IsPhaseModelEnabled(context) && binding?.NotifProcessingContext === emergencyNotificationType && CommonLibrary.isCurrentReadLinkLocal(binding?.['@odata.readLink'])) {
        return Promise.resolve([]);
    }

    if (IsPhaseModelEnabled(context) && MobileStatusLibrary.getMobileStatus(binding, context) === STARTED) {
        return Promise.resolve([{ 
            'Title': context.localizeText('complete_notification'), 
            'OnPress': '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationCompletePhaseModel.js',
            'Status': COMPLETED,
            'TransitionType': 'P', 
        }]);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/NotifMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
        //Save mobile status in the page's client data using key 'PhaseModelRollbackStatus'
        CommonLibrary.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0));
        let queryOptions = `$filter=UserPersona eq '${PersonaLibrary.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/NotifMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions).then(codes => {
            let popoverItems = [];

            codes.forEach(element => {
                // Go through each available next status and create a PopoverItems array
                let statusElement = element.NextOverallStatusCfg_Nav;
                let transitionText;
                let transitionType;
                if (element.TransitionType) {
                    transitionType = element.TransitionType;
                }

                transitionText = getTransitionText(context, statusElement);

                // Add items to possible transitions list
                if (statusElement.MobileStatus === COMPLETED) {
                    // Save statusElement since we can't pass it as a parameter to this rule
                    CommonLibrary.setStateVariable(context, 'StatusElement', statusElement);
                    // Prepend warning dialog to complete status change
                    popoverItems.push({
                        'Title': transitionText, 
                        'OnPress': {
                            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                            'Properties': {
                                'Title': context.localizeText('confirm_status_change'),
                                'Message': context.localizeText('notification_complete_warning'),
                                'OKCaption': context.localizeText('ok'),
                                'CancelCaption': context.localizeText('cancel'),
                                'OnOK': '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusComplete.js',
                                'OnCancel': '/SAPAssetManager/Rules/Notifications/MobileStatus/NotificationMobileStatusCompleteCancel.js',
                            },
                        },
                        'Enabled': '/SAPAssetManager/Rules/Notifications/MobileStatus/CanNotificationMobileStatusComplete.js',
                        'TransitionType': transitionType,
                        'Status': statusElement.MobileStatus,
                    });
                } else {
                    // Add all other items to possible transitions as-is
                    popoverItems.push({ 
                        'Title': transitionText, 
                        'OnPress': MobileStatusUpdateOverride(context, statusElement, 'NotifMobileStatus_Nav', onSuccessAction, binding), 
                        'TransitionType': transitionType,
                        'Status': statusElement.MobileStatus,
                    });
                }
            });

            return getPopoverItems(codes, popoverItems);
        });
    });
}

function getPopoverItems(codes, popoverItems) {
    if (codes.length > 0) {
        return popoverItems;
    } else {
        return Promise.resolve([]);
    }
}

function getTransitionText(context, statusElement) {
    // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
    if (statusElement.TransitionTextKey) {
        return context.localizeText(statusElement.TransitionTextKey);
    } else {
        return statusElement.OverallStatusLabel;
    }
}

