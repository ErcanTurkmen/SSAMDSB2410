import libCommon from '../../Common/Library/CommonLibrary';
import libPersona from '../../Persona/PersonaLibrary';
// Module-level variable to store the cached value
let cachedValueOperation = null;
export default function IsOperationLevelAssigmentType(context) {
     if (libPersona.isMaintenanceTechnician(context) || libPersona.isFieldServiceTechnicianInCSMode(context)) {
          let currentValue = libCommon.getWorkOrderAssnTypeLevel(context);
          cachedValueOperation = libCommon.updateCacheAndRedraw(context, cachedValueOperation, currentValue);
          return (currentValue === 'Operation');
     }
     return false;
}
