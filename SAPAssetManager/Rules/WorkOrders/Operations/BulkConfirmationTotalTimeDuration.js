import ConfirmationTotalDuration from '../../Confirmations/ConfirmationTotalDuration';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { TimeSheetLibrary } from '../../TimeSheets/TimeSheetLibrary';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';

export default function BulkConfirmationTotalTimeDuration(context) {
    let isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
    if (isTimesheetEnabled) {
        let hours = 0.0;

        const operations = CommonLibrary.getStateVariable(context, 'OperationsToConfirm');
        const currentOperation = operations.find(operation => operation.OperationReadlink === context.binding['@odata.readLink']);

        if (currentOperation) {
            hours += TimeSheetLibrary.getActualHours(context, currentOperation.Hours);
        }
    
        return context.localizeText('x_hours', [ConvertDoubleToHourString(hours)]);
    }

    return ConfirmationTotalDuration(context);
}
