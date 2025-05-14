import IsCrewComponentEnabled from '../../ComponentsEnablement/IsCrewComponentEnabled';
import IsAnotherTechnicianSelectEnabled from './IsAnotherTechnicianSelectEnabled';

/**
* Check if another technician can be selected
* No need to enable section when Crew enabled - it has its own comtrol to select employees
* @param {IClientAPI} clientAPI
*/
export default function CheckAnotherTechnicianSelectAccessible(clientAPI) {
    return !IsCrewComponentEnabled(clientAPI) && IsAnotherTechnicianSelectEnabled(clientAPI);
}
