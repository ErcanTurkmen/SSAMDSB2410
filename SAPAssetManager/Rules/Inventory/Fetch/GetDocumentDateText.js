import common from '../../Common/Library/CommonLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetDocumentDateText(clientAPI) {
    const binding = clientAPI.getBindingObject();
    if (binding.ObjectDate || binding.CountDate) {
        let date;
        if (binding.ObjectDate) {
            date = common.dateStringToUTCDatetime(binding.ObjectDate);
        } else {
            date = common.dateStringToUTCDatetime(binding.CountDate);
        }
        const dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }
    if (binding.IMObject === 'MDOC') {
        return binding.MatDocYear;
    }
    return '';
}
