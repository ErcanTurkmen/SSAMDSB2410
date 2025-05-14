import libCommon from '../../Common/Library/CommonLibrary';

export default function OrderNumberItemsVisible(context) {
    let move = libCommon.getStateVariable(context, 'IMMovementType');
    let order = libCommon.getStateVariable(context, 'CurrentDocsItemsOrderNumber');
    return !!(order && move === 'I');
}
