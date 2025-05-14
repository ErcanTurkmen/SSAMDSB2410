/**
* Show/Hide Operation Button
* @param {IClientAPI} context
*/
import EnableWorkOrderEdit from './EnableWorkOrderEdit';
import libPersona from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import libPhase from '../../PhaseModel/PhaseLibrary';
import libSupervisor from '../../Supervisor/SupervisorLibrary';

export default async function EnableOperationCreate(context) {
    const auth = await EnableWorkOrderEdit(context);

    if (libPersona.isMaintenanceTechnician(context)) {
        if (IsPhaseModelEnabled(context)) {
            const phaseOrder = await libPhase.isPhaseModelActiveInDataObject(context, context.binding);
            const isTechnician = await libSupervisor.isUserTechnician(context);

            // Do not allow creating operation if user is not supervisor and order is phase enabled
            if (phaseOrder && isTechnician) {
                return false;
            }
        }
    }

    return auth;
}
