import libAssignedTo from './AssignedToLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import { PartnerFunction } from '../../Common/Library/PartnerFunction';

/** @param {IListPickerFormCellProxy} context  */
export default function AssignedToFilterListPickerItems(context) {
    /** @type {import('./AssignedToLibrary').TypeAssignedToBinding} */
    const binding = context.getPageProxy().binding;
    const myPersonnelNumber = libCommon.getPersonnelNumber();
    const partnersNav = context.getPageProxy().binding.PartnersNavPropName;

    const pickerItems = [
        {
            DisplayValue: context.localizeText('unassigned'),
            ReturnValue: libAssignedTo.GetUnassignedReturnValue(partnersNav),
        },
        ...(binding.AssignedToMePickerItem ? [binding.AssignedToMePickerItem] : []),
    ];

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Employees', ['EmployeeName', 'PersonnelNumber'], '$orderby=EmployeeName')
        .then(result => pickerItems.concat([...new Map(result
            .filter((/** @type {Employee} */ item) => item.PersonnelNumber !== myPersonnelNumber)
            .map((/** @type {Employee} */ item) => [item.PersonnelNumber, EmployeeToPickerItem(item, partnersNav)])).values()]));
}

/** @param {Employee} employee  */
function EmployeeToPickerItem(employee, partnersNav) {
    return {
        DisplayValue: `${employee.EmployeeName} (${employee.PersonnelNumber})`,
        ReturnValue: `${partnersNav}/any(p: p/PartnerFunction eq '${PartnerFunction.getPersonnelPartnerFunction()}' and p/PersonnelNum eq '${employee.PersonnelNumber}')`,
    };
}
