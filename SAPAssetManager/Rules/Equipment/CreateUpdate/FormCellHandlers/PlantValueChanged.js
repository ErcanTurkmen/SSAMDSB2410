import PlantValueChangedCommon from '../../../Common/Controls/Handlers/PlantValueChanged';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function PlantValueChanged(context) {
    PlantValueChangedCommon(context);
    ResetValidationOnInput(context);
    let flocExtension = context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getExtension();
    if (flocExtension) {
        flocExtension.reload();
    }
    let equipExtension = context.getPageProxy().getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getExtension();
    if (equipExtension) {
        equipExtension.reload();
    }
}
