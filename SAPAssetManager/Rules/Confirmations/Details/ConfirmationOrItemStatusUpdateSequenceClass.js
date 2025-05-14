import libThis from './ConfirmationOrItemStatusUpdateSequenceClass';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';

/**
 * @typedef {import('../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass').UpdateSequenceItem} UpdateSequenceItem
 */

export default class ConfirmationOrItemStatusUpdateSequenceClass {

    /**
     * 
     * @param {IPageProxy} context 
     * @param {S4ServiceOrder} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getUpdateSequenceForStatus(context, binding) {
        if (binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue()) {
            return libThis.getConfirmationCompleteStatusUpdateSequence();
        }

        return libThis.getConfirmationItemCompleteStatusUpdateSequence();
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getConfirmationCompleteStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Confirmations/Details/CompleteConfirmation.js',
            },
        ];
    }
    
    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getConfirmationItemCompleteStatusUpdateSequence() {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Rule: '/SAPAssetManager/Rules/Confirmations/Item/CompleteConfirmationItem.js',
            },
        ];
    }
}
