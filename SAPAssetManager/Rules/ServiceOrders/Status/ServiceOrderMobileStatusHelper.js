import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libS4Service from '../S4ServiceLibrary';

export default class ServiceOrderMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context) {
        this._context = context;
    }
    
    /**
     * Returns if Started status is visible for order
     * @returns {boolean}
     */
    async isStartedStatusVisible() {
        const isAnyServiceOrderStarted = await libS4Service.isAnythingStarted(this._context);
        return !isAnyServiceOrderStarted;
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return libMobile.isServiceOrderStatusChangeable(this._context);
    }

    /**
     * Returns if Confirm/Unconfirm status transitions are visible
     * @returns {boolean}
     */
    isConfirmUnconfirmVisible() {
        return false;
    }
}
