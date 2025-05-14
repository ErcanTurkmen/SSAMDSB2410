import { WorkOrderLibrary } from '../WorkOrderLibrary';
import WorkOrderCreateUpdateDefault from './WorkOrderCreateUpdateDefault';

export default function WorkOrderCreateUpdateFollowOnValue(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    const flocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
    const flocExtension = flocControl.getExtension();
    const equipControl = formCellContainer.getControl('EquipHierarchyExtensionControl');
    const equipExtension = equipControl.getExtension();


    if (context.getValue()) {
        WorkOrderLibrary.setFollowOnFlag(context, true);

        //Restore initial Equipment and FLOC from original WO
        flocExtension.reload();
        equipExtension.reload();
    } else {
        WorkOrderLibrary.setFollowOnFlag(context, false);

        //Reset Equipment and FLOC
        //setEmptyValue needed for ignoring default values which set in extension OnLoaded event
        if (flocControl.getValue()) {
            flocExtension.reload().then(() => {
                flocControl.getClientData().setEmptyValue = true;
            });
        }

        if (equipControl.getValue()) {
            equipExtension.reload().then(() => {
                equipControl.getClientData().setEmptyValue = true;
            });
        }
    }

    const controls = ['DescriptionNote', 'MainWorkCenterLstPkr', 'WorkCenterPlantLstPkr', 'PlanningPlantLstPkr', 'BusinessAreaLstPkr', 'TypeLstPkr', 'LocationEditTitle']
        .map(controlName => formCellContainer.getControl(controlName))
        .filter(controlOrNull => !!controlOrNull);
    return Promise.all(controls.map(async control => control.setValue(await WorkOrderCreateUpdateDefault(control), true)));
}
