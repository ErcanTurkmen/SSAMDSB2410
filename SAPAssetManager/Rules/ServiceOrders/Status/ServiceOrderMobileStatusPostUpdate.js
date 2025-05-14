import LocationUpdate from '../../MobileStatus/LocationUpdate';
import MobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import ServiceConfirmationLibrary from '../../ServiceConfirmations/CreateUpdate/ServiceConfirmationLibrary';
import IsServiceOrderReleased from './IsServiceOrderReleased';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function ServiceOrderMobileStatusPostUpdate(context) {
    LocationUpdate(context);

    const updateResult = (() => {
        try {
            let data = JSON.parse(context.getActionResult('MobileStatusUpdate').data);
            return data;
        } catch (exc) {
            return context.binding.MobileStatus_Nav;
        }
    })();

    const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    if (updateResult.MobileStatus === HOLD) {
        return IsServiceOrderReleased(context, updateResult).then(isReleased => {
            if (isReleased) {
                let message = context.localizeText('confirmations_add_item_message');
                return MobileStatusLibrary.showWarningMessage(context, message).then(didSelectOk => {
                    if (didSelectOk) {
                        return updateMobileStatusHistory(context, updateResult).then(() => {
                            return ServiceConfirmationLibrary.getInstance().openConfirmatioPageForHoldFlow(context).then(() => {
                                return ToolbarRefresh(context);
                            });
                        });
                    }
                    return updateMobileStatusHistory(context, updateResult).then(() => {
                        return finilazeMobileStatusChange(context);
                    });
                });
            }
            return updateMobileStatusHistory(context, updateResult).then(() => {
                return finilazeMobileStatusChange(context);
            });
        });
    } else if (updateResult.MobileStatus === COMPLETE) {
        if (!IsCompleteAction(context)) {
            // For entities that go through consolidated complete screen success message is handled by complete action itself,
            // but we still need it for other entities like Confirmation/ConfirmationItem/ServiceRequest
            return finilazeMobileStatusChange(context);
        }

        return updateMobileStatusHistory(context, updateResult).then(() => {
            return ToolbarRefresh(context);
        });
    }
    return updateMobileStatusHistory(context, updateResult).then(() => {
        return finilazeMobileStatusChange(context);
    });
}

function updateMobileStatusHistory(context, mobileStatus) {
    context.showActivityIndicator('');

    let properties = {
        'MobileStatus': mobileStatus.MobileStatus,
        'Status': mobileStatus.Status,
        'EffectiveTimestamp': mobileStatus.EffectiveTimestamp,
        'CreateUserGUID': mobileStatus.CreateUserGUID,
        'CreateUserId': mobileStatus.CreateUserId,
    };

    return MobileStatusHistoryEntryCreate(context, properties, mobileStatus['@odata.readLink'])
        .catch(() => {
            // Roll back mobile status update
            return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
        })
        .finally(() => {
            context.dismissActivityIndicator();
        });
}

function finilazeMobileStatusChange(context) {
    return ToolbarRefresh(context).then(() => {
        return showStatusChangeSuccessMessage(context);
    });
}

export function showStatusChangeSuccessMessage(context) {
    const assnLevel = CommonLibrary.getS4AssnTypeLevel(context);

    let messageAction = '/SAPAssetManager/Actions/WorkOrders/MobileStatus/ServiceOrderMobileStatusSuccessMessage.action';
    if (assnLevel === 'Item') {
        messageAction = '/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemMobileStatusSuccessMessage.action';
    }
    return context.executeAction(messageAction).then(() => {
        return AutoSyncLibrary.autoSyncOnStatusChange(context);
    });
}
