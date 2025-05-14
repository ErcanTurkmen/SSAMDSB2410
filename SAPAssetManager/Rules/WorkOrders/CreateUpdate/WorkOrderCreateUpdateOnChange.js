import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import {WorkOrderEventLibrary as LibWoEvent} from '../WorkOrderLibrary';
export default function WorkOrderCreateUpdateOnChange(control) {
    ResetValidationOnInput(control);
    if (control.getName() === 'FuncLocHierarchyExtensionControl' || control.getName() === 'EquipHierarchyExtensionControl' || control.getName() === 'PlanningPlantLstPkr')  {
        LibWoEvent.createUpdateOnChange(control, true); // Set the isExtension optional flag to true if the rule is being called from extension control
    } else {
        if (control.getName() === 'TypeLstPkr') {
            control.getPageProxy().getClientData().LOADED = true;
        }
        LibWoEvent.createUpdateOnChange(control);
    }
}
