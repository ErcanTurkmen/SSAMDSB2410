import common from '../../Common/Library/CommonLibrary';

/**
 * Gets the document date for each inventory header object type
 */
 
export default function GetPostingDateForInventoryHeader(clientAPI) {
    const binding = clientAPI.getBindingObject();
    let statusValue;

    if (binding['@odata.readLink'] && binding['@odata.readLink'].includes('MaterialDocuments')) {
        statusValue = binding.PostingDate;
    } 
    
    if (statusValue) {
        const date = common.dateStringToUTCDatetime(statusValue);
        const dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
