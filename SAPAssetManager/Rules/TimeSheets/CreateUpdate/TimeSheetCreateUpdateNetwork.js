/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function TimeSheetCreateUpdateNetwork(clientAPI) {
    let value = clientAPI.evaluateTargetPath('#Control:Network/#Value');
    if (ValidationLibrary.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
