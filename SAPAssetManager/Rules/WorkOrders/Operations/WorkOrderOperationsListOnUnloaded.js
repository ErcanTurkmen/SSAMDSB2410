import CommonLibrary from '../../Common/Library/CommonLibrary';
/**
* Function to reset the state variable so that we get the right query options next time we go to operations list page
*/
export default function WorkOrderOperationsListOnUnloaded(context) {
    CommonLibrary.setStateVariable(context,'FromOperationsList', false);
}
