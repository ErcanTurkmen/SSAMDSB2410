import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotDetailsUsage(context) {
    if (Object.prototype.hasOwnProperty.call(context.binding,'InspectionCode_Nav') && !libVal.evalIsEmpty(context.binding.InspectionCode_Nav)) {
        return context.localizeText('inspection_lot') + ' - ' + context.binding.InspectionCode_Nav.CodeGroupDesc;
    }
    return '-';
}
