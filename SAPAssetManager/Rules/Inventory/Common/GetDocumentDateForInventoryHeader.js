import common from '../../Common/Library/CommonLibrary';

/**
 * Gets the document date for each inventory header object type
 */
 
export default function GetDocumentDateForInventoryHeader(clientAPI) {
    const binding = clientAPI.getBindingObject();
    let statusValue;

    if (binding['@odata.readLink'] && binding['@odata.readLink'].includes('ProductionOrderHeaders')) {
        statusValue = binding.BasicStartDate;
    } else if (binding['@odata.readLink'] && (binding['@odata.readLink'].includes('MaterialDocuments') || binding['@odata.readLink'].includes('PurchaseOrderHeaders'))) {
        statusValue = binding.DocumentDate;
    } else if (binding['@odata.readLink'] && binding['@odata.readLink'].includes('ReservationHeaders')) {
        statusValue = binding.ReservationDate;
    } else if (binding.MyInventoryObject_Nav) {
        statusValue = binding.MyInventoryObject_Nav.ObjectDate;
    }

    if (statusValue) {
        const date = common.dateStringToUTCDatetime(statusValue);
        const dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
