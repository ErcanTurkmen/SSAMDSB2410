import ServiceItemMobileStatusHelper from '../ServiceOrders/Item/ServiceItemMobileStatusHelper';
import ServiceRequestMobileStatusHelper from '../ServiceOrders/ServiceRequests/ServiceRequestMobileStatusHelper';
import ServiceOrderMobileStatusHelper from '../ServiceOrders/Status/ServiceOrderMobileStatusHelper';
import MobileStatusGenerator from './MobileStatusGenerator';

/**
 * @typedef {import('./MobileStatusGenerator').StatusOverride} StatusOverride
 */

export default class S4ServiceMobileStatusGenerator extends MobileStatusGenerator {

    /**
     * 
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {S4ServiceOrder | S4ServiceItem | S4ServiceRequest} binding 
     * @param {PMMobileStatus} currentStatus 
     * @param {string} objectType 
     */
    constructor(context, binding, currentStatus, objectType) {
        super(context, binding, currentStatus, objectType);
        this._helperClass = this._getMobileStatusHelperClass(context, objectType, binding, currentStatus);
    }
    
    /**
     * Get helper class for current object type that will help run data type specific checks
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {string} objectType 
     * @param {...*} params 
     * @returns {ServiceOrderMobileStatusHelper | ServiceItemMobileStatusHelper}
     */
    _getMobileStatusHelperClass(context, objectType, binding, currentStatus) {
        switch (objectType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue():
                return new ServiceOrderMobileStatusHelper(context);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue():
                return new ServiceItemMobileStatusHelper(context, binding, currentStatus);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/RequestMobileStatusObjectType.global').getValue():
                return new ServiceRequestMobileStatusHelper(context, binding, currentStatus);
            default:
                return new ServiceOrderMobileStatusHelper(context);

        }
    }

    /**
     * Get overrides for all possible statuses. Overrides contain additional info that we need to know to form correct set of UI items
     * (i.e. visibility, specific title, icon for context menu). If nothing needs to be overriden, default option will be used.
     * @returns {Object.<string, StatusOverride>}
     */
    async getAllMobileStatusOptions() {
        if (this._areStatusOptionsVisible()) {
            if (this._helperClass.isStatusChangeable()) {
                return {
                    [this._HOLD]: super._getHoldStatusOverrideProperties(),
                    [this._TRANSFER]: this._getTransferStatusOverrideProperties(),
                    [this._STARTED]: await this._getStartedStatusOverrideProperties(),
                    [this._COMPLETED]: this._getCompletedStatusOverrideProperties(),
                    [this._REJECTED]: this._getRejectedStatusOverrideProperties(),
                    [this._ACCEPTED]: this._getAcceptedStatusOverrideProperties(),
                    DEFAULT: super._getGenericStatusOverrideProperties(),
                };
            }

            if (await this._helperClass.isConfirmUnconfirmVisible()) {
                return {
                    [this._CONFIRM]: this._getConfirmStatusOverrideProperties(),
                    [this._UNCONFIRM]: this._getUnconfirmStatusOverrideProperties(),
                    DEFAULT: super._getGenericStatusOverrideProperties(false),
                };
            }
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
        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: await this._helperClass.isStartedStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            ContextMenu_Style: 'ContextMenuGreen',
        };
    }
    
    /**
     * Get override for Transfer status
     * @returns {StatusOverride}
     */
    _getTransferStatusOverrideProperties() {
        // method might not be defined in helper class, which means there are no extra conditions
        const Visible = typeof this._helperClass.isTransferStatusVisible === 'function' ?
        this._helperClass.isTransferStatusVisible() : true;

        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible,
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/transfer.png, /SAPAssetManager/Images/transfer.android.png)',
        };
    }
    
    /**
     * Get override for Completed status
     * @returns {StatusOverride}
     */
    _getCompletedStatusOverrideProperties() {
        // method might not be defined in helper class, which means there are no extra conditions
        const Visible = typeof this._helperClass.isCompletedStatusVisible === 'function' ?
            this._helperClass.isCompletedStatusVisible() : true;

        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible,
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',

        };
    }
    
    /**
     * Get override for Rejected status
     * @returns {StatusOverride}
     */
    _getRejectedStatusOverrideProperties() {
        // method might not be defined in helper class, which means there are no extra conditions
        const Visible = typeof this._helperClass.isRejectedStatusVisible === 'function' ?
            this._helperClass.isRejectedStatusVisible() : true;

        return {
            ...super._getRejectedStatusOverrideProperties(),
            Visible,
        };
    }
    
    /**
     * Get override for Accepted status
     * @returns {StatusOverride}
     */
    _getAcceptedStatusOverrideProperties() {
        // method might not be defined in helper class, which means there are no extra conditions
        const Visible = typeof this._helperClass.isAcceptedStatusVisible === 'function' ?
            this._helperClass.isAcceptedStatusVisible() : true;

        return {
            ...super._getAcceptedStatusOverrideProperties(),
            Visible,
        };
    }

    /**
     * Get override for Confirm status
     * @returns {StatusOverride}
     */
    _getConfirmStatusOverrideProperties() {
        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: this._helperClass.isConfirmStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/confirm.png, /SAPAssetManager/Images/confirm.android.png)',
            ExtraOption: true,
            TransitionType: 'S',
            TransitionText: this._context.localizeText('confirm_and_complete'),
            Status: this._CONFIRM,
        };
    }
    
    /**
     * Get override for Unconfirm status
     * @returns {StatusOverride}
     */
    _getUnconfirmStatusOverrideProperties() {
        return {
            ...super._getGenericStatusOverrideProperties(),
            Visible: this._helperClass.isUnconfirmStatusVisible(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/unconfirm.png, /SAPAssetManager/Images/unconfirm.android.png)',
            ExtraOption: true,
            TransitionType: 'T',
            TransitionText: this._context.localizeText('unconfirm'),
            Status: this._UNCONFIRM,
        };
    }

    /**
     * Returns if status can be changed or not
     * @returns {boolean}
     */
    _areStatusOptionsVisible() {
        // We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
        return !super._isLocalObjectAndEditingDisallowed();
    }
}
