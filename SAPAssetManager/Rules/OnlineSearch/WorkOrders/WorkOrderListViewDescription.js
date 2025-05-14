export default function WorkOrderListViewDescription(context) {
    let employeeNo = context.getBindingObject().AssignedTo;
    if (employeeNo !== '00000000' && employeeNo !== '') {
        if (employeeNo.length === 0) {
            return context.localizeText('unassigned');
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Employees', [], `$filter=(PersonnelNumber eq '${employeeNo}')`).then(result => {
            if (result.length === 0) {
                return context.localizeText('unassigned');
            }
            return `${context.localizeText('assignedto')} ${result.getItem(0).EmployeeName}`;
        }).catch((err) => {
            console.log(err);
        });
    } else {
        return context.localizeText('unassigned');
    }
}
