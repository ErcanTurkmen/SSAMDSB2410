import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotOperationMobileStatus(context) {
    if (Object.prototype.hasOwnProperty.call(context.binding,'OperationMobileStatus_Nav') && !libVal.evalIsEmpty(context.binding.OperationMobileStatus_Nav)) {
        return context.localizeText(context.binding.OperationMobileStatus_Nav.MobileStatus);
    }
    return '-';
}
