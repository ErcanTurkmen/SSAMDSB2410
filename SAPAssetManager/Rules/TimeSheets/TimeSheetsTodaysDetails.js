import TimeSheetData from './TimeSheetsData';
import Logger from '../Log/Logger';
import libCrew from '../Crew/CrewLibrary';

export default function TimeSheetsTodaysDetails(context) {
    const date = (() => {
        try {
            return context.getPageProxy().getActionBinding().Date;
        } catch (exc) {
            return new Date(); // if all else fails, assume current date
        }
    })();
    return TimeSheetData(context, date).then((data) => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CatsTimesheetOverviewRows', [], "$filter=Date eq datetime'" + data.Date + "'").then(function(results) {
            if (results && results.getItem(0)) {
                context.getPageProxy().setActionBinding(results.getItem(0));
                let action = libCrew.isCrewFeatureEnabled(context) ? '/SAPAssetManager/Actions/Crew/TimeSheets/TimeSheetDetailsNav.action' : '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action';
                return context.executeAction(action);
            } else {
                return Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryTimeSheets.global').getValue(), 'Record for Date ' + data.Date + ' not found in CatsTimesheetOverviewRows');
            }
        });
    }).catch(() => {
        if (!libCrew.isCrewFeatureEnabled(context)) {
            context.getPageProxy().setActionBinding({
                'Date': new Date(),
            });
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryDetailsNav.action');
        } return '';
    });
}
