import VehicleIsEnabled from '../Vehicle/VehicleIsEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function SideDrawerStockLookUp(context) {
    //Stock LookUp is hidden for S4
    if (IsS4ServiceIntegrationEnabled(context)) {
        return false;
    }
    
    let isFieldServiceTechnician = PersonaLibrary.isFieldServiceTechnician(context);
    let isMaintenanceTechnician = PersonaLibrary.isMaintenanceTechnician(context);
    let isVehicleEnabled = VehicleIsEnabled(context);
    return (isMaintenanceTechnician || isFieldServiceTechnician) && isVehicleEnabled;
}
