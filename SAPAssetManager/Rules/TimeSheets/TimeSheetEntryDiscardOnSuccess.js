/**
* Execute rule based on the component
* @param {IClientAPI} context
*/
import updateCrewAfterDiscard from './TimeSheetUpdateCrewAfterDiscard';
import deleteEntityOnSuccess from '../Common/DeleteEntityOnSuccess';
import libCrew from '../Crew/CrewLibrary';

export default function TimeSheetEntryDiscardOnSuccess(context) {
    if (libCrew.isCrewFeatureEnabled(context)) {
        return updateCrewAfterDiscard(context);
    } else {
        return deleteEntityOnSuccess(context);
    }
}
