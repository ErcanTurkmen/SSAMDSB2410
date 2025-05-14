import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import IsEditTechObjectFeatureEnabled from '../../../UserFeatures/IsEditTechObjectFeatureEnabled';

export default function EquipmentHierarchyListPickerOnLoaded(control) {
    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    let extension;
    let value;

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        if (!value && !ValidationLibrary.evalIsEmpty(context.binding)) {
            value = context.binding.FuncLocId;
        }
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
        }
    } else {
        value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        if (!value && !ValidationLibrary.evalIsEmpty(context.binding)) {
            value = context.binding.SuperiorEquip;
        }
        if (value) {
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
        }
    }
    if (extension) {
        extension.setData(value);
    }

    if (IsEditTechObjectFeatureEnabled(context) && !CommonLibrary.IsOnCreate(context)) {
        setTimeout(() => {
            formCellContainer.getControl(name).getExtension().setEditable(false);
        }, 200);
    }
}
