/**
* Check if Crew Component is enabled and execute the appropriate rule accordingly
* @param {IClientAPI} context
*/
import timeSheetUpdateCrew from '../Crew/TimeSheets/TimeSheetUpdateCrew';
import GetDuration from '../Confirmations/CreateUpdate/OnCommit/GetDuration';
import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import libCrew from '../Crew/CrewLibrary';

export default function TimeSheetEntrySuccessMessage(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        timeSheetUpdateCrew(context);
    } else {
        if (IsCompleteAction(context)) {
            WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                data: JSON.stringify(context.binding),
                value: ConvertDoubleToHourString(GetDuration(context)),
            });
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }

        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
    }
}
