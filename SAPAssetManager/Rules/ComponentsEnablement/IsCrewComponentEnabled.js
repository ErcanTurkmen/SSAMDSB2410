/**
* Check if Crew component is enabled to show member list inside Time Sheet
* @param {IClientAPI} context
*/
import libCrew from '../Crew/CrewLibrary';

export default function IsCrewComponentEnabled(context) {
    return libCrew.isCrewFeatureEnabled(context);
}
