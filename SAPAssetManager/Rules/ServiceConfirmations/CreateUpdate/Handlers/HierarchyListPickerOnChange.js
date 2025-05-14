import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function HierarchyListPickerOnChange(control) {
    let value = CommonLibrary.getControlValue(control);
    let pageProxy = control.getPageProxy();
    let flocControl = CommonLibrary.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl');
    let equipControl = CommonLibrary.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl');
    let productControl = CommonLibrary.getControlProxy(pageProxy, 'ProductIdLstPkr');

    if (value) {
        equipControl.setEditable(false);
        productControl.setEditable(false);
        flocControl.setEditable(false);

        if (control.getName() === 'FuncLocHierarchyExtensionControl') {
            flocControl.setEditable(true);
        } else if (control.getName() === 'EquipHierarchyExtensionControl') {
            equipControl.setEditable(true);
        } else {
            productControl.setEditable(true);
        }
    } else {
        flocControl.setEditable(true);
        equipControl.setEditable(true);
        productControl.setEditable(true);
    }
}
