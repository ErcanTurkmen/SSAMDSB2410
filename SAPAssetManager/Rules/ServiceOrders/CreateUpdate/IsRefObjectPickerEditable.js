import libCommon from '../../Common/Library/CommonLibrary';

export default function IsRefObjectPickerEditable(controlProxy) {
    const controlName = controlProxy.getName();
    const pageProxy = controlProxy.getPageProxy();
    const page = libCommon.getPageName(controlProxy);
    const binding = pageProxy.binding;
    let refObjectValues = {
        ProductLstPkr: binding.Product,
        FuncLocHierarchyExtensionControl: binding.HeaderFunctionLocation,
        EquipHierarchyExtensionControl: binding.HeaderEquipment,
    };

    if (page === 'ServiceRequestCreateUpdatePage' && binding.RefObj_Nav) {
        refObjectValues = {
            ProductLstPkr: binding.RefObj_Nav[0].ProductID,
            FuncLocHierarchyExtensionControl: binding.RefObj_Nav[0].FLocID,
            EquipHierarchyExtensionControl: binding.RefObj_Nav[0].EquipID,
        };
    }

    if (libCommon.isDefined(refObjectValues[controlName])) {
        return true;
    } else {
        return !Object.values(refObjectValues).some(refObj => libCommon.isDefined(refObj));
    }
}
