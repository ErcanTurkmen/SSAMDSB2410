import PhaseLibrary from '../PhaseModel/PhaseLibrary';
import MobileStatusGenerator from './MobileStatusGenerator';
import ClockInClockOutLibrary from '../ClockInClockOut/ClockInClockOutLibrary';

/**
 * @typedef {import('./MobileStatusGenerator').StatusOverride} StatusOverride
 */

export default class PhaseModelMobileStatusGenerator extends MobileStatusGenerator {

    /**
     * 
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyWorkOrderHeader | MyWorkOrderOperation | MyWorkOrderSubOperation} binding 
     * @param {PMMobileStatus} currentStatus 
     * @param {string} objectType 
     */
    constructor(context, binding, currentStatus, objectType) {
        super(context, binding, currentStatus, objectType);
    }

    /**
     * Get overrides for all possible statuses. Overrides contain additional info that we need to know to form correct set of UI items
     * (i.e. visibility, specific title, icon for context menu). If nothing needs to be overriden, default option will be used.
     * @returns {Object.<string, StatusOverride>}
     */
    async getAllMobileStatusOptions() {
        if (await this._areStatusOptionsVisible()) {
            const options = await super.getAllMobileStatusOptions();

            return {
                ...options,
            };
        }

        return {
            DEFAULT: super._getGenericStatusOverrideProperties(false),
        };
    }

    /**
     * Returns if status can be changed or not
     * @returns {boolean}
     */
    async _areStatusOptionsVisible() {
        const visibility = await super._areStatusOptionsVisible();

        if (visibility && !ClockInClockOutLibrary.isCICOEnabled(this._context)) {
            const isLocalPhaseObject = await PhaseLibrary.isLocalPhaseObject(this._context, this._binding);
            if (isLocalPhaseObject) {
                return false;
            }

            return typeof this._helperClass.isObjectAssignedToCurrentUser === 'function' ?
                this._helperClass.isObjectAssignedToCurrentUser() : true;
        }

        return visibility;
    }

    /**
     * Get override for Transfer status
     * @returns {StatusOverride}
     */
    async _getTransferStatusOverrideProperties() {
        const isPhaseObject = await PhaseLibrary.isPhaseModelActiveInDataObject(this._context, this._binding);

        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible: this._helperClass.isTransferStatusVisible(isPhaseObject),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/transfer.png, /SAPAssetManager/Images/transfer.android.png)',
        };
    }
}
