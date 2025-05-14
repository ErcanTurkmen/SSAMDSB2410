import enableFieldServiceTechnician from './EnableFieldServiceTechnician';
import enableMaintenanceTechnician from './EnableMaintenanceTechnician';
import enableMaintenanceTechnicianStd from './EnableMaintenanceTechnicianStd';
/**
* Check if persona assignment is maintenance or field technician
* @param {IClientAPI} context
*/
export default function EnableMultipleTechnician(context) {
    return enableFieldServiceTechnician(context) || enableMaintenanceTechnician(context) || enableMaintenanceTechnicianStd(context);
}
