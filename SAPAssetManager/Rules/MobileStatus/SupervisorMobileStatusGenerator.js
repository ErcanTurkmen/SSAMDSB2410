import libCICO from '../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libSupervisor from '../Supervisor/SupervisorLibrary';
import MobileStatusGenerator from './MobileStatusGenerator';
import MobileStatusLibrary from './MobileStatusLibrary';

/**
 * @typedef {import('./MobileStatusGenerator').StatusOverride} StatusOverride
 */

export default class SupervisorMobileStatusGenerator extends MobileStatusGenerator {

    /**
     * 
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyWorkOrderHeader | MyWorkOrderOperation | MyWorkOrderSubOperation} binding 
     * @param {PMMobileStatus} currentStatus 
     * @param {string} objectType 
     */
    constructor(context, binding, currentStatus, objectType) {
        super(context, binding, currentStatus, objectType);

        const { APPROVED, DISAPPROVED, REVIEW, ASSIGN, REASSIGN, UNASSIGN } = MobileStatusLibrary.getMobileStatusValueConstants(context);
        this._APPROVED = APPROVED;
        this._DISAPPROVED = DISAPPROVED;
        this._REVIEW = REVIEW;
        this._ASSIGN = ASSIGN;
        this._REASSIGN = REASSIGN;
        this._UNASSIGN = UNASSIGN;
    }

    /**
     * Retuns boolean value that represents if user is supervisor or not
     * @returns {boolean}
     */
    async _getIsSupervisor() {
        if (libCom.isDefined(this._isSupervisor)) {
            return this._isSupervisor;
        }

        const isSupervisor = await libSupervisor.isUserSupervisor(this._context);
        this._isSupervisor = isSupervisor;

        return isSupervisor;
    }

    /**
     * Get overrides for all possible statuses. Overrides contain additional info that we need to know to form correct set of UI items
     * (i.e. visibility, specific title, icon for context menu). If nothing needs to be overriden, default option will be used.
     * @returns {Object.<string, StatusOverride>}
     */
    async getAllMobileStatusOptions() {
        if (await this._areStatusOptionsVisible()) {
            const options = await super.getAllMobileStatusOptions();

            if (this._helperClass.isStatusChangeable()) {
                return {
                    ...options,
                    [this._STARTED]: await this._getStartedStatusOverrideProperties(),
                    [this._COMPLETED]: await this._getCompletedStatusOverrideProperties(),
                    [this._REVIEW]: await this._getReviewStatusOverrideProperties(),
                    [this._APPROVED]: this._getApproveStatusOverrideProperties(),
                    [this._DISAPPROVED]: this._getDisapproveStatusOverrideProperties(),
                    [this._ASSIGN]: await this._getAssignStatusOverrideProperties(),
                    [this._REASSIGN]: await this._getReAssignStatusOverrideProperties(),
                    [this._UNASSIGN]: await this._getUnAssignStatusOverrideProperties(),
                };
            }

            return options;
        }

        return {
            DEFAULT: super._getGenericStatusOverrideProperties(false),
        };
    }
    
    /**
     * Get override for Started status
     * @returns {StatusOverride}
     */
    async _getStartedStatusOverrideProperties() {
        const baseOverride = await super._getStartedStatusOverrideProperties();
        const isSupervisor = await this._getIsSupervisor();
        let isVisible = true;

        if (!isSupervisor && this._currentStatus?.MobileStatus === this._REVIEW) {
            isVisible = !!this._currentStatus['@sap.isLocal'];
        }

        return {
            ...baseOverride,
            Visible: baseOverride.Visible && isVisible,
        };
    }

    /**
     * Get override for Complete status
     * @returns {StatusOverride}
     */
    async _getCompletedStatusOverrideProperties() {
        const baseOverride = super._getCompletedStatusOverrideProperties();
        const isSupervisor = await this._getIsSupervisor();
        const isReviewRequired = await libSupervisor.checkReviewRequired(this._context, this._binding);
        const isCurrentStatusLocal = !!this._currentStatus['@sap.isLocal'];
        let isVisible = true;

        if (isSupervisor) {
            //Supervisor can only transition from DISAPPROVE to COMPLETE, if status change is local
            const isDisapprovedAndSynced = this._currentStatus?.MobileStatus === this._DISAPPROVED && !isCurrentStatusLocal;
            const isFromReviewStatus = this._currentStatus?.MobileStatus === this._REVIEW;

            if (isDisapprovedAndSynced || isFromReviewStatus) {
                isVisible = false;
            }
        } else {
            isVisible = !isReviewRequired;
        }

        return {
            ...baseOverride,
            Visible: baseOverride.Visible && isVisible,
        };
    }
   
    /**
     * Get override for Review status
     * @returns {StatusOverride}
     */
    async _getReviewStatusOverrideProperties() {
        const isReviewRequired = await libSupervisor.checkReviewRequired(this._context, this._binding);

        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: isReviewRequired,
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
        };
    }

    /**
     * Get override for Approve status
     * @returns {StatusOverride}
     */
    _getApproveStatusOverrideProperties() {
        return {
            ...super._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/accept.png, /SAPAssetManager/Images/accept.android.png)',
        };
    }

    /**
     * Get override for Disapprove status
     * @returns {StatusOverride}
     */
    _getDisapproveStatusOverrideProperties() {
        return {
            ...super._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/reject.png, /SAPAssetManager/Images/reject.android.png)',
        };
    }

    /**
     * Get override for Assign status
     * @returns {StatusOverride}
     */
    async _getAssignStatusOverrideProperties() {
        const isStarted = this._currentStatus?.MobileStatus === this._STARTED;
        const isAssignEnabled = await this._helperClass.isAssignStatusVisible();

        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: !isStarted && isAssignEnabled,
            TransitionType: 'S',
            TransitionText: this._context.localizeText('assign'),
            Status: this._ASSIGN,
            ExtraOption: true,
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/assign.png, /SAPAssetManager/Images/assign.android.png)',
        };
    }
    
    /**
     * Get override for Unassign status
     * @returns {StatusOverride}
     */
    async _getUnAssignStatusOverrideProperties() {
        const isStarted = this._currentStatus?.MobileStatus === this._STARTED;
        const isUnAssignReAssignEnabled = await this._helperClass.isUnassignReassignStatusVisible();

        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: !isStarted && isUnAssignReAssignEnabled,
            TransitionType: 'N',
            TransitionText: this._context.localizeText('unassign'),
            Status: this._UNASSIGN,
            ExtraOption: true,
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/unassign.png, /SAPAssetManager/Images/unassign.android.png)',
        };
    }
    
    /**
     * Get override for Reassign status
     * @returns {StatusOverride}
     */
    async _getReAssignStatusOverrideProperties() {
        const isStarted = this._currentStatus?.MobileStatus === this._STARTED;
        const isUnAssignReAssignEnabled = await this._helperClass.isUnassignReassignStatusVisible();
        
        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: !isStarted && isUnAssignReAssignEnabled,
            TransitionType: 'S',
            TransitionText: this._context.localizeText('reassign'),
            Status: this._REASSIGN,
            ExtraOption: true,
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/reassign.png, /SAPAssetManager/Images/reassign.android.png)',
        };
    }

    /**
     * Returns if status can be changed or not
     * @returns {boolean}
     */
    async _areStatusOptionsVisible() {
        const visibility = await super._areStatusOptionsVisible();

        if (visibility) {
            const currentMobileStatus = this._currentStatus.MobileStatus;
    
            //User may be clocked in to this business object regardless of what mobile status is set to, so allow change
            //Status may have been changed by another user, so trap that here
            if (libCICO.isBusinessObjectClockedIn(this._context, this._binding) && libCICO.allowClockInOverride(this._context, currentMobileStatus)) {
                return true;
            }
    
            return libSupervisor.isBusinessObjectEditable(this._context, this._binding);
        }

        return visibility;
    }
}
