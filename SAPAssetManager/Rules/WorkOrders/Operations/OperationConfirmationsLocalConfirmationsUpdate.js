import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function OperationConfirmationsLocalConfirmationsUpdate(clientAPI) {
    clientAPI.dismissActivityIndicator();
    libCom.removeStateVariable(clientAPI, 'IsBulkConfirmationActive');
    libCom.removeStateVariable(clientAPI, 'ConfirmationNoActionsReturnVariableName');
        
    const updatedItem = libCom.getStateVariable(clientAPI, 'OperationConfirmationsUpdatePayload');
    if (updatedItem) {
        const confirmOperations = libCom.getStateVariable(clientAPI, 'OperationsToConfirm');
        let updatedConfirmation = confirmOperations.find(item => item.OperationReadlink === updatedItem.OperationReadlink);
        if (updatedConfirmation) {
            updatedConfirmation = { 
                ...updatedConfirmation,
                SubOperation: updatedItem.SubOperation,
                VarianceReason: updatedItem.VarianceReason,
                ActivityType: updatedItem.ActivityType,
                AccountingIndicator: updatedItem.AccountingIndicator,
                Description: updatedItem.Description,
                FinalConfirmation: updatedItem.isFinalConfirmation ? 'X' : '',
                ActualWork: updatedItem.ActualDuration && updatedItem.ActualDuration.toString() || '15',
                ActualDuration: updatedItem.ActualDuration && updatedItem.ActualDuration.toString() || '15',
                StartTime: updatedItem.StartTime,
                PostingDate: updatedItem.PostingDate,
                StartDate: updatedItem.StartDate,
                StartTimeStamp: updatedItem.StartTimeStamp,
                FinishDate: updatedItem.FinishDate,
                FinishTime: updatedItem.FinishTime,
                CreatedDate: updatedItem.CreatedDate,
                CreatedTime: updatedItem.CreatedTime,
                Date: updatedItem.Date,
                Hours: updatedItem.Hours,
                AttendAbsenceType: updatedItem.AttendAbsenceType,
                MainWorkCenter: updatedItem.MainWorkCenter,
                PersonnelNumber: updatedItem.PersonnelNumber,
                ControllerArea: updatedItem.ControllerArea,
            };
            const newConfirmOperations = confirmOperations.filter(item => item.OperationReadlink !== updatedConfirmation.OperationReadlink);
            newConfirmOperations.push(updatedConfirmation);
            libCom.setStateVariable(clientAPI, 'OperationsToConfirm', newConfirmOperations);
        }
        libCom.removeStateVariable(clientAPI, 'OperationConfirmationsUpdatePayload');
        libCom.removeStateVariable(clientAPI, 'ConfirmationHideCancelOption');
        libCom.removeStateVariable(clientAPI, 'ConfirmationHideDiscardOption');
        clientAPI.getPageProxy().getControl('SectionedTable').redraw();
    }
}
