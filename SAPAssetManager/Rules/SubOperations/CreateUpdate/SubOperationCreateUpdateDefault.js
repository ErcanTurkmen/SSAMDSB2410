import libVal from '../../Common/Library/ValidationLibrary';
import EquipFLocIsAllowed from '../../WorkOrders/SubOperations/WorkOrderSubOperationIsEquipFuncLocAllowed';

export default function SubOperationCreateUpdateDefault(control) {
    
    if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
        control.getPageProxy()._context.binding = control.binding;
    }

    if (control.getPageProxy().getClientData().overrideValue) { //Do not reset to default value when control is reloaded
        control.getPageProxy().getClientData().overrideValue = false;
        return '';
    }
    
    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    let extension;
    let value;

    return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
        if (name === 'FuncLocHierarchyExtensionControl') {
            value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
            if (!value) {
                value = context.binding.OperationFunctionLocation;
            }
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
        } else {
            value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
            if (!value) {
                value = context.binding.OperationEquipment;
            }
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
        }
        
        handleExtension(result, extension, value);
        return '';
    });
}

function handleExtension(result, extension, value) {
    if (extension) {
        if (result) {
            extension.setData(value);
        } else {
            extension.setEditable(false);
        }
    }
}
