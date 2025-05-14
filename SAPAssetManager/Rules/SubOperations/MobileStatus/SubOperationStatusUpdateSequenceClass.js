import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libCICO from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import libThis from './SubOperationStatusUpdateSequenceClass';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import libSubOperationMobile from './SubOperationMobileStatusLibrary';

/**
 * @typedef {import('../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass').UpdateSequenceItem} UpdateSequenceItem
 */

const SUBOPERATION_MOBILE_STATUS_NAV_LINK = 'SubOpMobileStatus_Nav';

export default class SubOperationStatusUpdateSequenceClass {

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
            CONFIRM, UNCONFIRM,
        } = libMobile.getMobileStatusValueConstants(context);

        switch (status.MobileStatus) {
            case STARTED:
                return libThis.getStartStatusUpdateSequence(context, binding, status);
            case HOLD:
                return libThis.getHoldStatusUpdateSequence(context, binding, status);
            case COMPLETED:
                return libThis.getCompleteReviewStatusUpdateSequence();
            case TRANSFER:
                return libThis.getTransferStatusUpdateSequence(context);
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
                Name: SEQUENCE_ITEMS_NAMES.LOCATION_UPDATE,
                Rule: '/SAPAssetManager/Rules/MobileStatus/LocationUpdate.js',
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
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusSuccessMessage.action',
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
        const defaultUpdateSequence = libThis.getDefaultUpdateSequence(context, binding, status);
        const insertTimeCaptureIdx = defaultUpdateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.UPDATE_CICO) + 1;
        const insertUpdateFlagIdx = defaultUpdateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE) + 1;

        defaultUpdateSequence.splice(insertTimeCaptureIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.TIME_CAPTURE,
            Function: libSubOperationMobile.showTimeCaptureMessage.bind(null, context, binding, false),
        });

        defaultUpdateSequence.splice(insertUpdateFlagIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: libThis.updateIsAnythingStartedFlag.bind(null, context),
        });

        return defaultUpdateSequence;
    }

    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyWorkOrderHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getStartStatusUpdateSequence(context, binding, status) {
        const defaultUpdateSequence = libThis.getDefaultUpdateSequence(context, binding, status);
        const insertUpdateFlagIdx = defaultUpdateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE) + 1;

        defaultUpdateSequence.splice(insertUpdateFlagIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: libThis.updateIsAnythingStartedFlag.bind(null, context),
        });

        return defaultUpdateSequence;
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getCompleteReviewStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/WorkOrders/SubOperations/NavOnCompleteSubOperationPage.js',
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
                Function: libThis.showChangeStatusConfirmationDialog.bind(null, context, 'transfer_suboperation'),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Action: '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationTransferNav.action',
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
                Rule: '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationCompleteStatus.js',
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
                Rule: '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationUnconfirmStatus.js',
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
        libCom.removeStateVariable(context, 'IsOnOperationBinding');
    }
    
    static showChangeStatusConfirmationDialog(context, message) {
        return libMobile.showWarningMessage(context, context.localizeText(message)).then(confirmed => {
            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE, confirmed);
            MobileStatusUpdateResultsClass.getInstance().setSkipAll(!confirmed);
        });
    }

    static executeMobileStatusUpdateAction(context, status, binding) {
        const action = MobileStatusUpdateOverride(context, status, SUBOPERATION_MOBILE_STATUS_NAV_LINK, '', binding);

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
        libCom.removeStateVariable(context, 'isAnySubOperationStarted');
        return libSubOperationMobile.isAnySubOperationStarted(context);
    }
}
