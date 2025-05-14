import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libCICO from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ActivityUpdate from '../../MobileStatus/ActivityUpdate';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import libSupervisor from '../../Supervisor/SupervisorLibrary';
import WorkOrderCompletionLibrary from '../Complete/WorkOrderCompletionLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import libThis from './WorkOrderStatusUpdateSequenceClass';

/**
 * @typedef UpdateSequenceItem
 * @prop {string} Name
 * @prop {string} [Rule]
 * @prop {string} [Action]
 * @prop {string} [Function]
 */

const WORK_ORDER_MOBILE_STATUS_NAV_LINK = 'OrderMobileStatus_Nav';
export const SEQUENCE_ITEMS_NAMES = {
    CONFIRM_STATUS_CHANGE: 'CONFIRM_STATUS_CHANGE',
    ACTIONS_RESULTS_CREATE: 'ACTIONS_RESULTS_CREATE',
    LOCATION_UPDATE: 'LOCATION_UPDATE',
    PHASE_MODEL_STATUS_CHANGE: 'PHASE_MODEL_STATUS_CHANGE',
    ACTIVITY_UPDATE: 'ACTIVITY_UPDATE',
    RELOAD_TIME_ENTRIES: 'RELOAD_TIME_ENTRIES',
    MOBILE_STATUS_UPDATE: 'MOBILE_STATUS_UPDATE',
    MOBILE_STATUS_HISTORY: 'MOBILE_STATUS_HISTORY',
    TOOLBAR_REFRESH: 'TOOLBAR_REFRESH',
    SUCCESS_MESSAGE: 'SUCCESS_MESSAGE',
    AUTO_SYNC: 'AUTO_SYNC',
    ACTIONS_RESULTS_RESET: 'ACTIONS_RESULTS_RESET',
    CLEAR_FLAGS: 'CLEAR_FLAGS',
    UPDATE_CICO: 'UPDATE_CICO',
    TIME_CAPTURE: 'TIME_CAPTURE',
    AUTO_COMPLETE: 'AUTO_COMPLETE',
    ADD_CONFIRMATION_ITEM: 'ADD_CONFIRMATION_ITEM',
    ADD_CONFIRMATION_ITEM_DIALOG: 'ADD_CONFIRMATION_ITEM_DIALOG',
    SELF_ASSIGN: 'SELF_ASSIGN',
};

export default class WorkOrderStatusUpdateSequenceClass {

    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyWorkOrderHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static async getUpdateSequenceForStatus(context, binding, status) {
        const { STARTED, HOLD, COMPLETED, REVIEW, TRANSFER, WORKCOMPL, ASSIGN, REASSIGN, UNASSIGN, DISAPPROVED, APPROVED } = libMobile.getMobileStatusValueConstants(context);

        switch (status.MobileStatus) {
            case STARTED:
                return await libThis.getStartStatusUpdateSequence(context, binding, status);
            case HOLD:
                return libThis.getHoldStatusUpdateSequence(context, binding, status);
            case COMPLETED:
            case REVIEW:
                return libThis.getCompleteReviewStatusUpdateSequence();
            case TRANSFER:
                return libThis.getTransferStatusUpdateSequence();
            case WORKCOMPL:
                return libThis.getWorkCompletedStatusUpdateSequence(context, binding, status);
            case ASSIGN:
                return libThis.getAssignStatusUpdateSequence(context);
            case REASSIGN:
                return libThis.getReAssignStatusUpdateSequence(context);
            case UNASSIGN:
                return libThis.getUnAssignStatusUpdateSequence(context);
            case DISAPPROVED:
                return libThis.getDisapproveStatusUpdateSequence(context, status);
            case APPROVED:
                return libThis.getApproveStatusUpdateSequence(context, binding, status);
            default:
                return libThis.getDefaultUpdateSequence(context, binding, status);
        }
    }

    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyWorkOrderHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getDefaultUpdateSequence(context, binding, status) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_CREATE,
                Function: libThis.createActionResultsClassInstance,
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.LOCATION_UPDATE,
                Rule: '/SAPAssetManager/Rules/MobileStatus/LocationUpdate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.PHASE_MODEL_STATUS_CHANGE,
                Function: libMobile.phaseModelStatusChange.bind(null, context, status.MobileStatus),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIVITY_UPDATE,
                Function: ActivityUpdate.bind(null, context, binding, status),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Function: libThis.executeMobileStatusUpdateAction.bind(null, context, status, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_HISTORY,
                Rule: '/SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryCreate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.UPDATE_CICO,
                Function: libCICO.updateCICOOnStatusUpdate.bind(null, context, status.MobileStatus, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.RELOAD_TIME_ENTRIES,
                Function: libCICO.reloadUserTimeEntries.bind(null, context, false, undefined, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: '/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.clearStateVariables.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_RESET,
                Function: libThis.resetActionResults,
            },
        ];
    }
   
    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyWorkOrderHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getHoldStatusUpdateSequence(context, binding, status) {
        const updateSequence = libThis.getDefaultUpdateSequence(context, binding, status);

        updateSequence.splice(1, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
            Function: libThis.showStatusChangeConfirmationDialog.bind(null, context, status),
        });

        const insertIdx = updateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.UPDATE_CICO) + 1;
        updateSequence.splice(insertIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: libThis.updateIsAnythingStartedFlag.bind(null, context),
        },
        {
            Name: SEQUENCE_ITEMS_NAMES.TIME_CAPTURE,
            Function: libWOMobile.showTimeCaptureMessage.bind(null, context, status.MobileStatus, false, true, binding),
        });

        return updateSequence;
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static async getStartStatusUpdateSequence(context, binding, status) {
        const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const currentMobileStatus = binding[WORK_ORDER_MOBILE_STATUS_NAV_LINK]?.MobileStatus;
        const isClockedIn = libCICO.isBusinessObjectClockedIn(context, binding) && libCICO.allowClockInOverride(context, currentMobileStatus);
        const isAnythingStarted = await libWOMobile.isAnyWorkOrderStarted(context);
        const updateSequence = libThis.getDefaultUpdateSequence(context, binding, status);

        const insertUpdateFlagIdx = updateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.UPDATE_CICO) + 1;
        updateSequence.splice(insertUpdateFlagIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: libThis.updateIsAnythingStartedFlag.bind(null, context),
        });

        //If CICO enabled, current Work Order is started by someone else, and nothing is clocked in, do not transition; clock in immediately
        if (!isAnythingStarted && currentMobileStatus === STARTED && (libCICO.isCICOEnabled(context) && !isClockedIn)) {
            // delete mobile status update and history create actions from sequence
            const mobileStatusUpdateIdx = updateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE);
            updateSequence.splice(mobileStatusUpdateIdx, 2);
        }

        return updateSequence;
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getCompleteReviewStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/WorkOrders/NavOnCompleteWorkOrderPage.js',
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getTransferStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Action: '/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action',
            },
        ];
    }

     /**
     * 
     * @param {IPageProxy} context 
     * @param {MyWorkOrderHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
     static getWorkCompletedStatusUpdateSequence(context, binding, status) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_CREATE,
                Function: libThis.createActionResultsClassInstance,
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
                Function: libThis.showStatusChangeConfirmationDialog.bind(null, context, status),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.LOCATION_UPDATE,
                Rule: '/SAPAssetManager/Rules/MobileStatus/LocationUpdate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.PHASE_MODEL_STATUS_CHANGE,
                Function: libMobile.phaseModelStatusChange.bind(null, context, status.MobileStatus),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIVITY_UPDATE,
                Function: ActivityUpdate.bind(null, context, binding, status),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Function: libThis.executeMobileStatusUpdateAction.bind(null, context, status, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_HISTORY,
                Rule: '/SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryCreate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: '/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.clearStateVariables.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_RESET,
                Function: libThis.resetActionResults,
            },
        ];
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getAssignStatusUpdateSequence(context) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Supervisor/Assign/WorkOrderAssignNav.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.clearStateVariables.bind(null, context),
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getReAssignStatusUpdateSequence(context) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Supervisor/ReAssign/WorkOrderReAssignNav.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.clearStateVariables.bind(null, context),
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getUnAssignStatusUpdateSequence(context) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Supervisor/UnAssign/WorkOrderUnAssignNav.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.clearStateVariables.bind(null, context),
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getDisapproveStatusUpdateSequence(context, status) {
        libCom.setStateVariable(context, 'PhaseModelStatusElement', status);

        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.clearStateVariables.bind(null, context),
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getApproveStatusUpdateSequence(context, binding, status) {
        if (libSupervisor.isAutoCompleteOnApprovalEnabled(context)) {
            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(context, true);
            return [
                {
                    Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                    Function: libThis.executeMobileStatusUpdateAction.bind(null, context, status, binding),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.AUTO_COMPLETE,
                    Rule: '/SAPAssetManager/Rules/Supervisor/ApprovalPostUpdate.js',
                },
            ];
        }

        return libThis.getDefaultUpdateSequence(context, binding, status);
    }

    static createActionResultsClassInstance() {
        MobileStatusUpdateResultsClass.getInstance();
    }
    
    static resetActionResults() {
        MobileStatusUpdateResultsClass.getInstance().resetAll();
    }
    
    static clearStateVariables(context) {
        libCom.removeStateVariable(context, [
            'IsOnOperationBinding', 
            'PhaseModelStatusElement',
            'IsUnAssign',
            'IsReAssign',
            'IsAssign',
        ]);
    }
    
    static showStatusChangeConfirmationDialog(context, status) {
        const statusText = context.localizeText(status.MobileStatus);
        const message = context.localizeText('change_wo_status_message', [statusText]);
        const caption = context.localizeText('confirm_status_change');

        return libMobile.showWarningMessage(context, message, caption).then(confirmed => {
            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE, confirmed);
            MobileStatusUpdateResultsClass.getInstance().setSkipAll(!confirmed);
        });
    }

    static executeMobileStatusUpdateAction(context, status, binding) {
        const action = MobileStatusUpdateOverride(context, status, WORK_ORDER_MOBILE_STATUS_NAV_LINK, '', binding);

        return context.executeAction(action).then(result => {
            let updateResult;

            try {
                updateResult = JSON.parse(result.data);
            } catch (exc) {
                updateResult = {};
            }

            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE, updateResult);
        });
    }

    static updateIsAnythingStartedFlag(context) {
        libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
        return libWOMobile.isAnyWorkOrderStarted(context);
    }
}
