import libVal from '../../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionPointValuationStatus(context) {
    if (Object.prototype.hasOwnProperty.call(context.binding,'InspValuation_Nav') && !libVal.evalIsEmpty(context.binding.InspValuation_Nav)) {
        return context.binding.InspValuation_Nav.ShortText;
    }
    return '-';
}
