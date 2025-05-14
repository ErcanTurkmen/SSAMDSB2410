import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import IsAssignEnableWorkOrderOperation from './IsAssignEnableWorkOrderOperation';
import IsUnAssignEnableWorkOrderOperation from './IsUnAssignEnableWorkOrderOperation';
import libOperationMobile from './OperationMobileStatusLibrary';

export default class OperationMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context, binding, currentStatus, objectType) {
        this._context = context;
        this._binding = binding;
        this._objectType = objectType;
        this._currentStatus = currentStatus;

        const { STARTED } = libMobile.getMobileStatusValueConstants(context);
        this._STARTED = STARTED;
    }
    
    /**
     * Returns if Started status is visible for order
     * @returns {boolean}
     */
    async isAnythingStarted() {
        const isAnyOperationStarted = await libOperationMobile.isAnyOperationStarted(this._context);
        return isAnyOperationStarted;
    }
    
    /**
     * Returns if Completed status is visible for order
     * @returns {boolean}
     */
    isCompletedStatusVisible() {
        return true;
    }

    /**
     * Returns if Work Completed status is visible for order
     * @returns {boolean}
     */
    isWorkCompletedStatusVisible() {
        return false;
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return libMobile.isOperationStatusChangeable(this._context);
    }

    /**
     * Returns if Confirm/Unconfirm status transitions are visible
     * @returns {boolean}
     */
    isConfirmUnconfirmVisible() {
        const WOMobileStatus = libMobile.getMobileStatus(this._binding.WOHeader, this._context);

        return WOMobileStatus === this._STARTED;
    }

    async isConfirmStatusVisible() {
        const isConfirmed = await this.getIsOperationConfirmed();

        return !isConfirmed;
    }
    
    async isUnconfirmStatusVisible() {
        const isConfirmed = await this.getIsOperationConfirmed();

        return isConfirmed;
    }
    
    async getIsOperationConfirmed() {
        if (libCom.isDefined(this._isOperationConfirmed)) {
            return this._isOperationConfirmed;
        }

        const isConfirmed = await libMobile.isMobileStatusConfirmed(this._context, this._binding);
        this._isOperationConfirmed = isConfirmed;

        return isConfirmed;
    }
    
    isTransferStatusVisible(isPhaseObject = false) {
        const assignmentType = libCom.getWorkOrderAssignmentType(this._context);
        const isLocal = libCom.isCurrentReadLinkLocal(this._binding['@odata.readLink']);

        return !isLocal && !['4', 'A'].includes(assignmentType) && !isPhaseObject;
    }

    isAssignStatusVisible() {
        return IsAssignEnableWorkOrderOperation(this._context, this._binding);
    }
   
    isUnassignReassignStatusVisible() {
        return IsUnAssignEnableWorkOrderOperation(this._context, this._binding);
    }

    isObjectAssignedToCurrentUser() {
        const DEFAULT_PERSON_NUM = '00000000';
        
        return this._binding.PersonNum === libCom.getPersonnelNumber() || this._binding.PersonNum === DEFAULT_PERSON_NUM;
    }
}
