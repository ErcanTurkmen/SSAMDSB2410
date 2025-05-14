import ConfirmationCreateUpdateNav from '../../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import libCommon from '../../Common/Library/CommonLibrary';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';

export default function WorkOrderOperationConfirmationCreateNav(context) {
    let binding = context.getBindingObject();
    if (context.getPageProxy().getExecutedContextMenuItem()) {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    if (binding.selectedOperations || context.getPageProxy().getActionBinding()) {
        binding = context.getPageProxy().getActionBinding();
    }
    const data = libCommon.getStateVariable(context, 'OperationsToConfirm');
    //gets the correct binding when executing rule from context swipe menu
    const selectedItem = data.find(item => item.OperationReadlink === binding['@odata.readLink']);
    if (selectedItem) {
        let override = {
            'WorkOrderHeader': selectedItem.WorkOrderHeader,
            'OrderID': selectedItem.OrderID,
            'ActivityType': selectedItem.ActivityType,
            'AccountingIndicator': selectedItem.AccountingIndicator,
            'Operation': selectedItem.Operation,
            'ActualDuration': selectedItem.ActualDuration,
            'ActualDurationUOM': selectedItem.ActualDurationUOM,
            'IsWorkOrderChangable': false,
            'IsOperationChangable': false,
            'IsOnCreate': false,
            'VarianceReason': selectedItem.VarianceReason,
            'Description': selectedItem.Description,
            'Plant': selectedItem.Plant,
            'IsFinal': selectedItem.FinalConfirmation === 'X',
            'OperationReadlink': selectedItem.OperationReadlink,
            'PersonnelNumber': selectedItem.PersonnelNumber,
        };

        libCommon.setStateVariable(context, 'ConfirmationNoActionsReturnVariableName', 'OperationConfirmationsUpdatePayload');
        libCommon.setStateVariable(context, 'ConfirmationHideCancelOption', true);
        libCommon.setStateVariable(context, 'ConfirmationHideDiscardOption', true);

        //gets the correct binding when executing rule from context swipe menu
        let isTimesheetEnabled = !ConfirmationsIsEnabled(context) && TimeSheetsIsEnabled(context);
        if (isTimesheetEnabled) {
            libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
            libCommon.setStateVariable(context, 'IsBulkConfirmationActive', true);
            
            override = {
                'WorkOrderHeader': selectedItem.WorkOrderHeader,
                'OrderId': selectedItem.OrderID,
                'ActivityType': selectedItem.ActivityType,
                'Date': selectedItem.Date,
                'Hours': selectedItem.Hours,
                'AttendAbsenceType': selectedItem.AttendAbsenceType,
                'OperationReadlink': selectedItem.OperationReadlink,
                'PersonnelNumber': selectedItem.PersonnelNumber,
            };

            context.getPageProxy().getClientData().timesheetArgs = override;
            context.getPageProxy().setActionBinding(override);
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
        } else {
            if (context.getPageProxy()) {
                return ConfirmationCreateUpdateNav(context.getPageProxy(), override, selectedItem.StartTime, new Date(), true);
            } else {
                return ConfirmationCreateUpdateNav(context, override, selectedItem.StartTime, new Date(), true);
            }
        }
    }
}
