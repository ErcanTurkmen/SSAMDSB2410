import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libCICO from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ActivityUpdate from '../../MobileStatus/ActivityUpdate';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import libSupervisor from '../../Supervisor/SupervisorLibrary';
import libThis from './OperationStatusUpdateSequenceClass';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import OperationSelfAssign from '../../MobileStatus/OperationSelfAssign';
import libOperationMobile from './OperationMobileStatusLibrary';
import libPhase from '../../PhaseModel/PhaseLibrary';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import IsConfirmationEnabledOperation from '../IsConfirmationEnabledOperation';
import ApprovalPostUpdate from '../../Supervisor/ApprovalPostUpdate';
import { getUpdateToStatusConfig } from '../../MobileStatus/RunMobileStatusUpdateSequence';

/**
 * @typedef {import('../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass').UpdateSequenceItem} UpdateSequenceItem
 */

const OPERATION_MOBILE_STATUS_NAV_LINK = 'OperationMobileStatus_Nav';

export default class OperationStatusUpdateSequenceClass {

    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyWorkOrderHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static async getUpdateSequenceForStatus(context, binding, status) {
        const {
            STARTED, HOLD, COMPLETED, TRANSFER,
            REVIEW, ASSIGN, REASSIGN, UNASSIGN, DISAPPROVED, APPROVED,
            REJECTED, CONFIRM, UNCONFIRM,
        } = libMobile.getMobileStatusValueConstants(context);

        if (await libThis.isPhaseStatusChangeBlocked(context, binding, status)) {
            return libThis.getPhaseBlockedTransitionMessage(context);
        }

        switch (status.MobileStatus) {
            case STARTED:
                return await libThis.getStartStatusUpdateSequence(context, binding, status);
            case HOLD:
                return await libThis.getHoldStatusUpdateSequence(context, binding, status);
            case COMPLETED:
            case REVIEW:
                return libThis.getCompleteReviewStatusUpdateSequence();
            case TRANSFER:
                return libThis.getTransferStatusUpdateSequence(context);
            case ASSIGN:
                return libThis.getAssignStatusUpdateSequence(context);
            case REASSIGN:
                return libThis.getReAssignStatusUpdateSequence(context);
            case UNASSIGN:
                return libThis.getUnAssignStatusUpdateSequence(context);
            case DISAPPROVED:
                return libThis.getDisapproveStatusUpdateSequence(context, status);
            case APPROVED:
                return await libThis.getApproveStatusUpdateSequence(context, binding, status);
            case REJECTED:
                return libThis.getRejectStatusUpdateSequence(context, binding, status);
            case CONFIRM:
                return libThis.getConfirmStatusUpdateSequence();
            case UNCONFIRM:
                return libThis.getUnconfirmStatusUpdateSequence();
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
                Name: SEQUENCE_ITEMS_NAMES.SELF_ASSIGN,
                Function: OperationSelfAssign.bind(null, context, binding),
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
                Action: '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action',
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
    static async getHoldStatusUpdateSequence(context, binding, status) {
        const defaultUpdateSequence = libThis.getDefaultUpdateSequence(context, binding, status);

        defaultUpdateSequence.splice(1, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
            Function: libThis.showChangeStatusConfirmationDialog.bind(null, context, 'hold_operation_warning_message'),
        });

        const insertIdx = defaultUpdateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.UPDATE_CICO) + 1;
        defaultUpdateSequence.splice(insertIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: libThis.updateIsAnythingStartedFlag.bind(null, context),
        });

        if (await IsConfirmationEnabledOperation(context, binding)) {
            defaultUpdateSequence.splice(insertIdx + 1, 0, {
                Name: SEQUENCE_ITEMS_NAMES.TIME_CAPTURE,
                Function: libOperationMobile.showTimeCaptureMessage.bind(null, context, status.MobileStatus),
            });
        }

        return defaultUpdateSequence;
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static async getStartStatusUpdateSequence(context, binding, status) {
        const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const currentMobileStatus = binding[OPERATION_MOBILE_STATUS_NAV_LINK]?.MobileStatus;
        const isClockedIn = libCICO.isBusinessObjectClockedIn(context, binding) && libCICO.allowClockInOverride(context, currentMobileStatus);
        const isAnythingStarted = await libOperationMobile.isAnyOperationStarted(context);
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
                Rule: '/SAPAssetManager/Rules/WorkOrders/Operations/NavOnCompleteOperationPage.js',
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getTransferStatusUpdateSequence(context) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
                Function: libThis.showChangeStatusConfirmationDialog.bind(null, context, 'transfer_operation_warning_message'),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Action: '/SAPAssetManager/Actions/WorkOrders/Operations/OperationTransferNav.action',
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
                Rule: '/SAPAssetManager/Rules/Supervisor/Assign/OperationAssignNav.js',
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
                Rule: '/SAPAssetManager/Rules/Supervisor/ReAssign/OperationReAssignNav.js',
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
                Rule: '/SAPAssetManager/Rules/Supervisor/UnAssign/OperationUnAssignNav.js',
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
    static async getApproveStatusUpdateSequence(context, binding, status) {
        if (libSupervisor.isAutoCompleteOnApprovalEnabled(context)) {
            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(context, true);
            const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            const completedStatusConfig = await getUpdateToStatusConfig(context, binding, {
                MobileStatus: COMPLETED,
            }, status.ObjectType);
            const isCompletionBlocked = await libThis.isPhaseStatusChangeBlocked(context, binding, completedStatusConfig);

            return [
                {
                    Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                    Function: libThis.executeMobileStatusUpdateAction.bind(null, context, status, binding),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.AUTO_COMPLETE,
                    Function: ApprovalPostUpdate.bind(null, context, isCompletionBlocked),
                },
            ];
        }

        return libThis.getDefaultUpdateSequence(context, binding, status);
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getRejectStatusUpdateSequence(context, binding, status) {
        libCom.setStateVariable(context, 'RejectStatusElement', status);
        libCom.setStateVariable(context, 'IsOnRejectOperationBinding', binding);

        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/MobileStatus/OperationRejectCreateRejectReasonNav.js',
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
    static getConfirmStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Operations/MobileStatus/OperationConfirmStatus.js',
            },
        ];
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getUnconfirmStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Operations/MobileStatus/OperationUnconfirmStatus.js',
            },
        ];
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getPhaseBlockedTransitionMessage(context) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Action: libPhase.getPhaseStatusChangeBlockedMessageAction(context),
            },
        ];
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
            'RejectStatusElement',
            'IsOnRejectOperationBinding',
            'IsUnAssign',
            'IsReAssign',
            'IsAssign',
        ]);
    }
    
    static showChangeStatusConfirmationDialog(context, message) {
        return libMobile.showWarningMessage(context, context.localizeText(message)).then(confirmed => {
            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE, confirmed);
            MobileStatusUpdateResultsClass.getInstance().setSkipAll(!confirmed);
        });
    }

    static executeMobileStatusUpdateAction(context, status, binding) {
        const action = MobileStatusUpdateOverride(context, status, OPERATION_MOBILE_STATUS_NAV_LINK, '', binding);
        
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

    static async isPhaseStatusChangeBlocked(context, binding, status) {
        const stopKeys = await libPhase.getActivePhaseControls(context, binding);
        
        return libPhase.isPhaseStatusChangeBlocked(stopKeys, status);
    }

    static updateIsAnythingStartedFlag(context) {
        libCom.removeStateVariable(context, 'isAnyOperationStarted');
        return libOperationMobile.isAnyOperationStarted(context);
    }
}
