import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationSelected(clientAPI) {
    //If select all is active then as the new object cells are being built, they will show as selected
    return CommonLibrary.getStateVariable(clientAPI, 'selectAllActive', 'WorkOrderOperationsListViewPage');
}
