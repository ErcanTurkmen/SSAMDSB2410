import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import libThis from './S4ServiceObjectsStatusUpdateSequenceClass';
import S4MobileStatusUpdateOverride from './S4MobileStatusUpdateOverride';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import libS4 from '../S4ServiceLibrary';

/**
 * @typedef {import('../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass').UpdateSequenceItem} UpdateSequenceItem
 */

const SERVICE_ORDER_MOBILE_STATUS_NAV_LINK = 'MobileStatus_Nav';

export default class S4ServiceObjectsStatusUpdateSequenceClass {

    /**
     * 
     * @param {IPageProxy} context 
     * @param {S4ServiceOrder} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getUpdateSequenceForStatus(context, binding, status) {
        const { STARTED, HOLD, COMPLETED, TRANSFER, REJECTED, CONFIRM, UNCONFIRM } = libMobile.getMobileStatusValueConstants(context);

        switch (status.MobileStatus) {
            case STARTED:
                return libThis.getStartStatusUpdateSequence(context, binding, status);
            case HOLD:
                return libThis.getHoldStatusUpdateSequence(context, binding, status);
            case COMPLETED:
                return libThis.getCompleteStatusUpdateSequence(context, binding, status);
            case TRANSFER:
                return libThis.getTransferStatusUpdateSequence(context, binding);
            case REJECTED:
                return libThis.getRejectStatusUpdateSequence(context, status);
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
     * @param {S4ServiceOrder} binding 
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
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: libThis.getSuccessMessageAction(context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
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
     * @param {S4ServiceOrder} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getHoldStatusUpdateSequence(context, binding, status) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_CREATE,
                Function: libThis.createActionResultsClassInstance,
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
                Function: libThis.showHoldConfirmationDialog.bind(null, context, status),
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
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.updateIsAnythingStartedFlag.bind(null, context, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_HISTORY,
                Rule: '/SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryCreate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ADD_CONFIRMATION_ITEM_DIALOG,
                Rule: '/SAPAssetManager/Rules/ServiceOrders/Status/ShowAddConfirmationItemDialog.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ADD_CONFIRMATION_ITEM,
                Rule: '/SAPAssetManager/Rules/ServiceOrders/Status/AddConfirmationItem.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: libThis.getSuccessMessageAction(context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
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
    static getStartStatusUpdateSequence(context, binding, status) {
        const defaultUpdateSequence = libThis.getDefaultUpdateSequence(context, binding, status);
        const insertUpdateFlagIdx = defaultUpdateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE) + 1;

        defaultUpdateSequence.splice(insertUpdateFlagIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: libThis.updateIsAnythingStartedFlag.bind(null, context, binding),
        });

        return defaultUpdateSequence;
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getCompleteStatusUpdateSequence(context, binding, status) {
        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue():
                return [
                    {
                        Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                        Rule: '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/MobileStatus/NavOnCompleteServiceItemPage.js',
                    },
                ];
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue():
                return [
                    {
                        Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
                        Function: libThis.showCompleteServiceRequestConfirmationDialog.bind(null, context),
                    },
                    ...libThis.getDefaultUpdateSequence(context, binding, status),
                ];
            default:
                return [
                    {
                        Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                        Rule: '/SAPAssetManager/Rules/ServiceOrders/Status/NavOnCompleteServiceOrderPage.js',
                    },
                ];
        }

    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getTransferStatusUpdateSequence(context, binding) {
        let Action;
        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue():
                Action = '/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemTransferNav.action';
                break;
            default:
                Action = '/SAPAssetManager/Actions/ServiceOrders/Status/ServiceOrderTransferNav.action';
                break;
        }

        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Action,
            },
        ];
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getRejectStatusUpdateSequence(context, status) {
        libCom.setStateVariable(context, 'PhaseModelStatusElement', status);
        
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js',
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
                Rule: '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/ServiceItemConfirmStatus.js',
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
                Rule: '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/ServiceItemUnconfirmStatus.js',
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
        libCom.removeStateVariable(context, 'PhaseModelStatusElement');
    }
    
    static showHoldConfirmationDialog(context) {
        const message = libCom.getS4AssnTypeLevel(context) === 'Header' ?
            'hold_service_order' :
            'hold_service_item';

        return libMobile.showWarningMessage(context, context.localizeText(message)).then(confirmed => {
            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE, confirmed);
            MobileStatusUpdateResultsClass.getInstance().setSkipAll(!confirmed);
        });
    }
    
    static showCompleteServiceRequestConfirmationDialog(context) {
        return libMobile.showWarningMessage(context, context.localizeText('complete_service_request')).then(confirmed => {
            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE, confirmed);
            MobileStatusUpdateResultsClass.getInstance().setSkipAll(!confirmed);
        });
    }

    static executeMobileStatusUpdateAction(context, status, binding) {
        const action = S4MobileStatusUpdateOverride(context, binding, status, SERVICE_ORDER_MOBILE_STATUS_NAV_LINK, '');
        
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

    static getSuccessMessageAction(context) {
        if (libCom.getS4AssnTypeLevel(context) === 'Item') {
            return '/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemMobileStatusSuccessMessage.action';
        }

        return '/SAPAssetManager/Actions/WorkOrders/MobileStatus/ServiceOrderMobileStatusSuccessMessage.action';
    }

    static updateIsAnythingStartedFlag(context, binding) {
        if ([
            context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue(),
            context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue(),
        ].includes(binding['@odata.type'])) {
            let stateVarName = 'isAnyOrderStarted';
            let entitySet = 'S4ServiceOrders';

            if (libCom.getS4AssnTypeLevel(context) === 'Item') {
                stateVarName = 'IsAnyOperationStarted';
                entitySet = 'S4ServiceItems';
            }

            libCom.removeStateVariable(context, stateVarName);
            return libS4.isAnythingStarted(context, entitySet, stateVarName);
        }

        return Promise.resolve();
    }
}
