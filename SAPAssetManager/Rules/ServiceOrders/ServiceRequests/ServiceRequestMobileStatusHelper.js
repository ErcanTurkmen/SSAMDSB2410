export default class ServiceRequestMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context, binding, currentStatus) {
        this._context = context;
        this._binding = binding;
        this._currentStatus = currentStatus;
    }
    
    /**
     * Returns if Started status is visible for order
     * @returns {boolean}
     */
    isStartedStatusVisible() {
       return true;
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return true;
    }

    /**
     * Returns if Confirm/Unconfirm status transitions are visible
     * @returns {boolean}
     */
    isConfirmUnconfirmVisible() {
        return false;
    }

    /**
     * Returns if Rejected status is visible
     * @returns {boolean}
     */
    isRejectedStatusVisible() {
        return false;
    }
   
    /**
     * Returns if Transfer status is visible
     * @returns {boolean}
     */
    isTransferStatusVisible() {
        return false;
    }
    
    /**
     * Returns if Accepted status is visible
     * @returns {boolean}
     */
    isAcceptedStatusVisible() {
        return false;
    }
}
