import libCom from '../../Common/Library/CommonLibrary';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';

export default function WorkOrderOperationIsFinalConfirmation(context) {
  let isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
  if (isTimesheetEnabled) {
    return '';
  }

  let operations = libCom.getStateVariable(context, 'OperationsToConfirm');
  let finalConfirmation = operations.find(operation => operation.OrderID === context.binding.OrderId && operation.Operation === context.binding.OperationNo).FinalConfirmation;
  if (finalConfirmation) {
    return context.localizeText('final_confirmation');
  } else {
    return context.localizeText('partial_confirmation');
  }
}
