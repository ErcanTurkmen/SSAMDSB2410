import TimeSheetCreateUpdateDate from './TimeSheetCreateUpdateDate';
import FetchRequest from '../../Common/Query/FetchRequest';
import commonLib from '../../Common/Library/CommonLibrary';
import CrewLibrary from '../../Crew/CrewLibrary';
import TimeSheetEntryUpdateDate from './TimeSheetEntryUpdateDate';
import TimeSheetCreateUpdateControllerArea from './TimeSheetCreateUpdateControllerArea';
import TimeSheetCreateUpdateWorkCenter from './TimeSheetCreateUpdateWorkCenter';
import TimeSheetCreateUpdateActivityType from './TimeSheetCreateUpdateActivityType';
import TimeSheetCreateUpdateAttAbsType from './TimeSheetCreateUpdateAttAbsType';
import TimeSheetCreateUpdateHours from './TimeSheetCreateUpdateHours';
import TimeSheetEntryEditValidation from '../Entry/CreateUpdate/TimeSheetEntryEditValidation';
import TimeSheetGetPersonnelNumber from './TimeSheetGetPersonnelNumber';

export default function TimeSheetCreateUpdateOnCommit(context) {
    if ((commonLib.IsOnCreate(context) || CrewLibrary.getTimesheetRemoveFlag()) && CrewLibrary.isCrewFeatureEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Crew/TimeSheets/TimeSheetsEntryRequiredFields.action');
    }

    const noODataActionReturnVariable = commonLib.getStateVariable(context, 'ConfirmationNoActionsReturnVariableName');
    if (noODataActionReturnVariable) {
        return TimeSheetEntryEditValidation(context).then((isValid) => {
            if (isValid) {
                return storeTimesheetDataForBulkConfirmation(context, noODataActionReturnVariable).then(()=>{
                    return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
                });
            } else {
                return Promise.resolve();
            }
        });
    }

    return createOverviewIfMissing(context).then(() => {

        let pageName = commonLib.getCurrentPageName(context);

        let action;
        switch (pageName) {

            case 'TimeEntryCreateUpdatePageForWO':
            case 'TimeEntryCreateUpdatePage':
                action = '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateCreate.action';
                break;
            case 'TimeSheetEntryEditPage':
                action = '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateUpdate.action';
                break;

            default:
                return Promise.reject(false);

        }

        return context.executeAction(action);
    });
}


function createOverviewIfMissing(context) {

    let date = TimeSheetCreateUpdateDate(context);

    return new FetchRequest('CatsTimesheetOverviewRows').get(context, `datetime'${date}'`).catch(() => {
        // This is missing
        return createOverviewRow(context, date);
    });

}

function createOverviewRow(context, date) {
    context.getClientData().TimeSheetsOverviewRowDate = date;
    return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetOverviewRowCreate.action');
}

function storeTimesheetDataForBulkConfirmation(context, noODataActionReturnVariable) {
    let previousClientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let timesheetArgs = previousClientData.timesheetArgs ? previousClientData.timesheetArgs : {};
    
    return TimeSheetCreateUpdateControllerArea(context).then(controllerArea => {
        const updateArgs = {
            ...timesheetArgs,
            'Date': TimeSheetEntryUpdateDate(context),
            'Hours': TimeSheetCreateUpdateHours(context),
            'AttendAbsenceType': TimeSheetCreateUpdateAttAbsType(context),
            'ActivityType': TimeSheetCreateUpdateActivityType(context),
            'MainWorkCenter': TimeSheetCreateUpdateWorkCenter(context),
            'PersonnelNumber': TimeSheetGetPersonnelNumber(context),
            'ControllerArea': controllerArea,
        };
    
        commonLib.setStateVariable(context, noODataActionReturnVariable, updateArgs);
        return Promise.resolve();
    });
}
