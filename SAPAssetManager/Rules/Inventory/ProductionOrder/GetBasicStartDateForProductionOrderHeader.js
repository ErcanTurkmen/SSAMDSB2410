import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function GetBasicStartDateForProductionOrderHeader(context) {
    let basicStartDate = context.binding.BasicStartDate;

    if (!libVal.evalIsEmpty(basicStartDate)) {
        let date = new ODataDate(basicStartDate).toLocalDateString();
        let dateText = context.formatDate(date);
        return dateText;
    } 
    return '';
}
