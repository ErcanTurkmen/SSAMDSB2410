import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';
/**
* This function gets the Physical Inventory Count date...
* @param {IClientAPI} context
*/
export default function GetCountdateForInventoryHeader(context) {
    const statusValue = context.binding.CountDate;
    if (!libVal.evalIsEmpty(statusValue)) {
        let oDataDate = new ODataDate(statusValue).toLocalDateString();       
        const dateText = context.formatDate(oDataDate);
        return dateText;         
    }
    return '';
}
