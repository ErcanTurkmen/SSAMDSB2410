import libCom from '../../Common/Library/CommonLibrary';

export default function GetFailedOperationsActivityType(context) {
    let operationsConfirmations = libCom.getStateVariable(context, 'OperationsToConfirm');
    const res = [];
    operationsConfirmations.map((item, index) => {
        if (!item.ActivityType) {
            res.push(`${index === 0 ? '' : '\n'}${item.OperationShortText} - ${item.Operation}`);
        }
    });

    return context.localizeText('validation_activity_type_is_required_workorder_for_operations', [res]);
}
