/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function TimeSheetCreateUpdateWBSElement(clientAPI) {
    let value = clientAPI.evaluateTargetPath('#Control:WBS/#Value');
    if (ValidationLibrary.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
