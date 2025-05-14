import libCom from '../../Common/Library/CommonLibrary';
import updateGroupPickers from './UpdateGroupPickers';
import updateSoldToPartyPickers from './NotificationCreateUpdateSoldToPartyPickers';

export default function NotificationCreateUpdateHierarchyListPickerOnLoaded(control) {
    
    if (control.getPageProxy().getClientData().overrideValue) { //Do not reset to default value when control is reloaded
        control.getPageProxy().getClientData().overrideValue = false;
        return '';
    }
    
    let name = control.getName();
    let context = control.getPageProxy();

    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return setDefaultListPickerValue(context, name);
    } else if (context.binding.OperationOrderId) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${context.binding.OperationOrderId}'`).then(result => {
            let workOrder = result.getItem(0);
            return setDefaultListPickerValue(context, name, workOrder);
        });
    } else {
        return setDefaultListPickerValue(context, name);
    }
}

function setDefaultListPickerValue(context, name, workOrder = {}) {
    let formCellContainer = context.getControl('FormCellContainer');
    let extension;
    let value;

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
        if (!value) {
            value = context.binding.HeaderFunctionLocation || workOrder.HeaderFunctionLocation;
        }
        if (value) {
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getExtension();
        }
    } else {
        value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
        if (!value) {
            value = context.binding.HeaderEquipment || workOrder.HeaderEquipment;
        }
        if (value) {
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl').getExtension();
        }
    }
    if (extension) {
        extension.setData(value).then(() => updateGroupPickers(context)).then(() => updateSoldToPartyPickers(context));
        //resave initial values after default picker value was set
        libCom.saveInitialValues(context);
    }
}
