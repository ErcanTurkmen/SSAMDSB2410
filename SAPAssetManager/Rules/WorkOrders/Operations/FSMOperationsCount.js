import CommonLibrary from '../../Common/Library/CommonLibrary';
import WorkOrderOperationsFSMQueryOption from './WorkOrderOperationsFSMQueryOption';
export default function WorkOrderOperationsCount(context) {
    return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
        let queryString = '$filter=' + fsmQueryOptions;
        return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderOperations', queryString);
    }).catch(() => {
        return 0;
    });
}
