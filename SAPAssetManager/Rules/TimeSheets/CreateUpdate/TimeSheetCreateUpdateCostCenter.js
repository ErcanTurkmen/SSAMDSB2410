/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function TimeSheetCreateUpdateCostCenter(clientAPI) {
    let value = clientAPI.evaluateTargetPath('#Control:CostCenter/#Value');
    if (ValidationLibrary.evalIsEmpty(value)) {
        return '';
    }
    return value;
}
