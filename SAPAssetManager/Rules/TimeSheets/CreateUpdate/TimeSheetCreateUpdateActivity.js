/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function TimeSheetCreateUpdateActivity(clientAPI) {
    let value = clientAPI.evaluateTargetPath('#Control:ActivityNum/#Value');
    if (ValidationLibrary.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
