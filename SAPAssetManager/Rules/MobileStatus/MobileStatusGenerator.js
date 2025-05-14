import libCICO from '../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../Common/Library/CommonLibrary';
import OperationMobileStatusHelper from '../Operations/MobileStatus/OperationMobileStatusHelper';
import SubOperationMobileStatusHelper from '../SubOperations/MobileStatus/SubOperationMobileStatusHelper';
import WorkOrderMobileStatusHelper from '../WorkOrders/MobileStatus/WorkOrderMobileStatusHelper';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import libMobile from './MobileStatusLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

/**
 * @typedef StatusOverride
 * @prop {boolean} Visible
 * @prop {string} [TransitionText]
 * @prop {string} [Status]
 * @prop {string} [TransitionType]
 * @prop {string} [ExtraOption]
 * @prop {boolean} [OnlyOption]
 * @prop {string} [ContextMenu_Icon]
 * @prop {string} [ContextMenu_Mode]
 * @prop {string} [ContextMenu_Style]
 */

export default class MobileStatusGenerator {

    /**
     * 
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyWorkOrderHeader | MyWorkOrderOperation | MyWorkOrderSubOperation} binding 
     * @param {PMMobileStatus} currentStatus 
     * @param {string} objectType 
     */
    constructor(context, binding, currentStatus, objectType) {
        this._context = context;
        this._binding = binding;
        this._currentStatus = currentStatus;
        this._objectType = objectType;
        this._helperClass = this._getMobileStatusHelperClass(context, binding, currentStatus, objectType);

        const { 
            HOLD, STARTED, COMPLETED, WORKCOMPL, TRANSFER, 
            CONFIRM, UNCONFIRM, 
            ACCEPTED, ONSITE, TRAVEL, REJECTED, REVIEW,
        } = libMobile.getMobileStatusValueConstants(context);
        
        this._HOLD = HOLD;
        this._STARTED = STARTED;
        this._COMPLETED = COMPLETED;
        this._WORKCOMPL = WORKCOMPL;
        this._TRANSFER = TRANSFER;
        this._CONFIRM = CONFIRM;
        this._UNCONFIRM = UNCONFIRM;
        this._ACCEPTED = ACCEPTED;
        this._ONSITE = ONSITE;
        this._TRAVEL = TRAVEL;
        this._REJECTED = REJECTED;
        this._REVIEW = REVIEW;
    }
    
    /**
     * Get helper class for current object type that will help run data type specific checks
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyWorkOrderHeader | MyWorkOrderOperation | MyWorkOrderSubOperation} binding 
     * @param {...*} params
     * @returns {WorkOrderMobileStatusHelper | OperationMobileStatusHelper | SubOperationMobileStatusHelper}
     */
    _getMobileStatusHelperClass(context, binding, ...params) {
        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
                return new WorkOrderMobileStatusHelper(context, binding, ...params);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue():
                return new OperationMobileStatusHelper(context, binding, ...params);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
                return new SubOperationMobileStatusHelper(context, binding, ...params);
            default:
                return new WorkOrderMobileStatusHelper(context, binding, ...params);
        }
    }

    /**
     * Get overrides for all possible statuses. Overrides contain additional info that we need to know to form correct set of UI items
     * (i.e. visibility, specific title, icon for context menu). If nothing needs to be overriden, default option will be used.
     * @returns {Object.<string, StatusOverride>}
     */
    async getAllMobileStatusOptions() {
        if (await this._areStatusOptionsVisible()) {
            if (this._helperClass.isStatusChangeable()) {
                return {
                    [this._STARTED]: await this._getStartedStatusOverrideProperties(),
                    [this._COMPLETED]: this._getCompletedStatusOverrideProperties(),
                    [this._HOLD]: this._getHoldStatusOverrideProperties(),
                    [this._WORKCOMPL]: this._getWorkCompletedStatusOverrideProperties(),
                    [this._TRANSFER]: await this._getTransferStatusOverrideProperties(),
                    [this._ACCEPTED]: this._getAcceptedStatusOverrideProperties(),
                    [this._REJECTED]: this._getRejectedStatusOverrideProperties(),
                    [this._TRAVEL]: this._getEnrouteStatusOverrideProperties(),
                    [this._ONSITE]: this._getOnsiteStatusOverrideProperties(),
                    [this._REVIEW]: this._getGenericStatusOverrideProperties(false),
                    DEFAULT: this._getGenericStatusOverrideProperties(),
                };
            }

            if (this._helperClass.isConfirmUnconfirmVisible()) {
                return {
                    [this._CONFIRM]: await this._getConfirmStatusOverrideProperties(),
                    [this._UNCONFIRM]: await this._getUnconfirmStatusOverrideProperties(),
                    DEFAULT: this._getGenericStatusOverrideProperties(false),
                };
            }
        }

        return {
            DEFAULT: this._getGenericStatusOverrideProperties(false),
        };
    }

    /**
     * Get default override object
     * @returns {StatusOverride}
     */
    _getGenericStatusOverrideProperties(visible = true) {
        return {
            Visible: visible,
        };
    }

    /**
     * Get override for Hold status
     * @returns {StatusOverride}
     */
    _getHoldStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/hold.png, /SAPAssetManager/Images/hold.android.png)',
        };
    }
    
    /**
     * Get override for Transfer status
     * @returns {StatusOverride}
     */
    _getTransferStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: this._helperClass.isTransferStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/transfer.png, /SAPAssetManager/Images/transfer.android.png)',
        };
    }
    
    /**
     * Get override for Started status
     * @returns {StatusOverride}
     */
    async _getStartedStatusOverrideProperties() {
        const currentMobileStatus = this._currentStatus.MobileStatus;
        const isAnythingStarted = await this._helperClass.isAnythingStarted();
        const isClockedIn = libCICO.isBusinessObjectClockedIn(this._context, this._binding) && libCICO.allowClockInOverride(this._context, currentMobileStatus);
        let OnlyOption = false, ExtraOption = false, TransitionType;
        const isOperationHeaderLevelAssignment = ['Header', 'Operation'].includes(libCom.getWorkOrderAssnTypeLevel(this._context));

        //If CICO enabled, current Work Order is started by someone else, and nothing is clocked in, do not transition; clock in immediately
        if (isOperationHeaderLevelAssignment && !isAnythingStarted && currentMobileStatus === this._STARTED && (libCICO.isCICOEnabled(this._context) && !isClockedIn)) {
            OnlyOption = true;
            ExtraOption = true;
            TransitionType = 'P';
        }

        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: !isAnythingStarted,
            TransitionText: libCICO.isCICOEnabled(this._context) && isOperationHeaderLevelAssignment ? this._context.localizeText('clock_in') : '',
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            ContextMenu_Style: 'ContextMenuGreen',
            OnlyOption,
            ExtraOption,
            Status: this._STARTED,
            TransitionType,
        };
    }
    
    /**
     * Get override for Completed status
     * @returns {StatusOverride}
     */
    _getCompletedStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: this._helperClass.isCompletedStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
        };
    }
    
    /**
     * Get override for Work Completed status
     * @returns {StatusOverride}
     */
    _getWorkCompletedStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: this._helperClass.isWorkCompletedStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
        };
    }

    /**
     * Get override for Confirm status
     * @returns {StatusOverride}
     */
    async _getConfirmStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: await this._helperClass.isConfirmStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/confirm.png, /SAPAssetManager/Images/confirm.android.png)',
            ExtraOption: true,
            TransitionType: 'S',
            TransitionText: this._context.localizeText('confirm'),
            Status: this._CONFIRM,
        };
    }
    
    /**
     * Get override for Unconfirm status
     * @returns {StatusOverride}
     */
    async _getUnconfirmStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: await this._helperClass.isUnconfirmStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/unconfirm.png, /SAPAssetManager/Images/unconfirm.android.png)',
            ExtraOption: true,
            TransitionType: 'S',
            TransitionText: this._context.localizeText('unconfirm'),
            Status: this._UNCONFIRM,
        };
    }

    /**
     * Get override for Accept status
     * @returns {StatusOverride}
     */
    _getAcceptedStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/accept.png, /SAPAssetManager/Images/accept.android.png)',
            ContextMenu_Style: 'ContextMenuGreen',
        };
    }
    
    /**
     * Get override for Reject status
     * @returns {StatusOverride}
     */
    _getRejectedStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/reject.png, /SAPAssetManager/Images/reject.android.png)',
            ContextMenu_Mode: 'Deletion',
        };
    }

    /**
     * Get override for Enroute status
     * @returns {StatusOverride}
     */
    _getEnrouteStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: PersonaLibrary.isFieldServiceTechnician(this._context),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/enroute.png, /SAPAssetManager/Images/enroute.android.png)',
        };
    }

    /**
     * Get override for Onsite status
     * @returns {StatusOverride}
     */
    _getOnsiteStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/onsite.png, /SAPAssetManager/Images/onsite.android.png)',
        };
    }

    /**
     * Returns if status can be changed or not
     * @returns {boolean}
     */
    async _areStatusOptionsVisible() {
        const isAnythingStarted = await this._helperClass.isAnythingStarted();
        const isClockedIn = libCICO.isBusinessObjectClockedIn(this._context, this._binding);
        const currentMobileStatus = this._currentStatus.MobileStatus;
        
        // Bussiness object is started, but user is not clocked in and has another started-clocked in objects, so disable status options
        if (currentMobileStatus === this._STARTED && (libCICO.isCICOEnabled(this._context) && !isClockedIn) && isAnythingStarted) {
            return false;
        }

        // We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N or
        // if business object in Created state
        return !(this._isLocalObjectAndEditingDisallowed() || libWO.isWorkOrderInCreatedState(this._context, this._binding));
    }

    /**
     * Returns if editing local object is disallowed
     * @returns {boolean}
     */
    _isLocalObjectAndEditingDisallowed() {
        const isLocal = libCom.isCurrentReadLinkLocal(this._binding['@odata.readLink']);

        return isLocal && !libCom.isAppParameterEnabled(this._context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects');
    }
}
