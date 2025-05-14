/**
* Data Subscripton array for Time Sheet Entried List Page if Crew component is enabled
* @param {IClientAPI} context
*/
import libCrew from '../CrewLibrary';

export default function TimeSheetEntriesListDataSubscription(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        return ['CrewLists','CrewListItems'];
    }
    return [];
}
