import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsCrewComponentEnabled from '../../ComponentsEnablement/IsCrewComponentEnabled';
import EmployeeQueryOptions from './EmployeeQueryOptions';

export default async function EmployeePickerItems(context) {
    let pickerItems = [];

    if (IsCrewComponentEnabled(context)) {
        const currentEmployeePersonnelNumber = CommonLibrary.getPersonnelNumber();
        const crewMembers = await context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], EmployeeQueryOptions(context));

        if (crewMembers.length) {  // if there are members in the crew, display all in the picker
            crewMembers.forEach(member => {
                pickerItems.push({
                    'DisplayValue': member.Employee.EmployeeName + ' - ' + member.Employee.PersonnelNumber,
                    'ReturnValue': member.Employee.PersonnelNumber,
                });
            });
        } else if (currentEmployeePersonnelNumber) { // if there are no members in the crew, display current user in the picker
            const currentEmployee = await context.read('/SAPAssetManager/Services/AssetManager.service', 'Employees', ['EmployeeName'], `$filter=PersonnelNumber eq '${currentEmployeePersonnelNumber}'`).then(result => result.length ? result.getItem(0) : null);

            if (currentEmployee) {
                pickerItems.push({
                    'DisplayValue': currentEmployee.EmployeeName + ' - ' + currentEmployeePersonnelNumber,
                    'ReturnValue': currentEmployeePersonnelNumber, 
                });
            }
        }
    }

    return pickerItems;
}
