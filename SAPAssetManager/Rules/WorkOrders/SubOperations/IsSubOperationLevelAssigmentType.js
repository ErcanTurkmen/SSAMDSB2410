import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import libCommon from '../../Common/Library/CommonLibrary';
// Module-level variable to store the cached value
let cachedValueSubOperation = null;
export default function IsSubOperationLevelAssigmentType(context) {
     if (enableMaintenanceTechnician(context)) {
          //Return true if Sub Operation level assigment type
          let currentValue = libCommon.getWorkOrderAssnTypeLevel(context);
          cachedValueSubOperation = libCommon.updateCacheAndRedraw(context, cachedValueSubOperation, currentValue);
          return (currentValue === 'SubOperation');
     }
     return false;
}
