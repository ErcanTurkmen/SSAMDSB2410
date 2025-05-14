import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotShortDescription(context) {
    if (Object.prototype.hasOwnProperty.call(context.binding,'ShortDesc') && !libVal.evalIsEmpty(context.binding.ShortDesc)) {
        return context.binding.ShortDesc;
    }
    return '-';
}
