import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libS4Service from '../S4ServiceLibrary';
import IsServiceItemCategory from '../ServiceItems/IsServiceItemCategory';

export default class ServiceItemMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context, binding, currentStatus) {
        this._context = context;
        this._binding = binding;
        this._currentStatus = currentStatus;
        this._isServiceItem = IsServiceItemCategory(context);

        const { STARTED, COMPLETED, RECEIVED } = libMobile.getMobileStatusValueConstants(context);
        this._STARTED = STARTED;
        this._COMPLETED = COMPLETED;
        this._RECEIVED = RECEIVED;
    }
    
    /**
     * Returns if Started status is visible for order
     * @returns {boolean}
     */
    async isStartedStatusVisible() {
        const isAnyServiceOrderStarted = await libS4Service.isAnythingStarted(this._context, 'S4ServiceItems', 'IsAnyOperationStarted');
        return !isAnyServiceOrderStarted;
    }
    
    /**
     * Returns if Completed status is visible for order
     * exclude the Received -> Completed transition for service product type items
     * @returns {boolean}
     */
    isCompletedStatusVisible() {
        return !(this._currentStatus.MobileStatus === this._RECEIVED && this._isServiceItem);
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return libMobile.isServiceItemStatusChangeable(this._context);
    }

    /**
     * Returns if Confirm/Unconfirm status transitions are visible
     * @returns {boolean}
     */
    async isConfirmUnconfirmVisible() {
		if (await this.isParentObjectStarted()) {
            const isItemCompleted = this._currentStatus.MobileStatus === this._COMPLETED;
            const isItemStatusLocal = this._currentStatus['@sap.isLocal'];

            // we can confirm or unconfirm locally completed item 
            if ((isItemCompleted && isItemStatusLocal) || !isItemCompleted) {
                return true;
            }
        }

        return false;
    }
    
    /**
     * Returns if Confirm status is visible
     * @returns {boolean}
     */
    isConfirmStatusVisible() {
        return this._currentStatus.MobileStatus !== this._COMPLETED;            
    }

    /**
     * Returns if Unconfirm status is visible
     * @returns {boolean}
     */
    isUnconfirmStatusVisible() {
        return this._currentStatus.MobileStatus === this._COMPLETED && this._currentStatus['@sap.isLocal'];
    }

    /**
     * Returns if parent object of a service item is started or not
     * @returns {boolean}
     */
    async isParentObjectStarted() {
        const orderNavLink = this._binding['@odata.readLink'] + '/S4ServiceOrder_Nav';
        const parentOrder = await this._context.read('/SAPAssetManager/Services/AssetManager.service', orderNavLink, 
            [], '$expand=MobileStatus_Nav&$select=MobileStatus_Nav/MobileStatus');

        return parentOrder?.getItem(0)?.MobileStatus_Nav?.MobileStatus === this._STARTED;
    }

    /**
     * Returns if Rejected status is visible
     * @returns {boolean}
     */
    isRejectedStatusVisible() {
        return libMobile.serviceItemRejectTransferAvailable(this._context);
    }
   
    /**
     * Returns if Transfer status is visible
     * @returns {boolean}
     */
    isTransferStatusVisible() {
        return libMobile.serviceItemRejectTransferAvailable(this._context) && this._isServiceItem;
    }
    
    /**
     * Returns if Accepted status is visible
     * @returns {boolean}
     */
    isAcceptedStatusVisible() {
        return this._isServiceItem;
    }
}
