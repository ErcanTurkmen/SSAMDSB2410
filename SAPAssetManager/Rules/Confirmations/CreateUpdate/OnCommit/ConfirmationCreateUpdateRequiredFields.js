import IsAnotherTechnicianSelectEnabled from '../../../TimeSheets/CreateUpdate/IsAnotherTechnicianSelectEnabled';

/**
* Adding 'ResponciblePersonelNum' to reuired fields if picker visible
* @param {IClientAPI} clientAPI
*/
export default function ConfirmationCreateUpdateRequiredFields(clientAPI) {
    const requiredFields = ['OperationPkr', 'WorkOrderLstPkr'];

    if (IsAnotherTechnicianSelectEnabled(clientAPI)) {
        requiredFields.push('ResponciblePersonelNum');
    }

    return requiredFields;
}
