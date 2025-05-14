import { GlobalVar } from '../../Common/Library/GlobalCommon';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/**
* Determine if Save button should be visible or not
* @param {IClientAPI} clientAPI
*/
export default function FSMFormSaveVisible(clientAPI) {
    let fsm = !ValidationLibrary.evalIsEmpty(GlobalVar.getUserSystemInfo().get('FSM_EMPLOYEE'));
    return !clientAPI.getPageProxy().binding.Closed && fsm;
}
