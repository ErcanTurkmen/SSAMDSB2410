import piStatus from '../PhysicalInventory/PhysicalInventoryDocCountTotals';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetInboundDocumentStatusText(clientAPI) {
    let binding = clientAPI.getBindingObject();
    let statusValue = null;
    let isOutbound = false;

    // for that case we don't need any status, just show mdoc year
    if (binding.MaterialDocument_Nav) {
        return binding.MaterialDocument_Nav.MaterialDocYear;
    }

    if (binding.PurchaseOrderHeader_Nav) {
        statusValue = binding.PurchaseOrderHeader_Nav.DocumentStatus;
    } else if (binding.InboundDelivery_Nav) { 
        statusValue = binding.InboundDelivery_Nav.GoodsMvtStatus;
        statusValue = handleStatusValue(statusValue);
    } else if (binding.OutboundDelivery_Nav) { 
        statusValue = binding.OutboundDelivery_Nav.GoodsMvtStatus;
        statusValue = handleStatusValue(statusValue);
        isOutbound = true;
    } else if (binding.ReservationHeader_Nav) { 
        statusValue = binding.ReservationHeader_Nav.DocumentStatus;
        isOutbound = true;
    } else if (binding.StockTransportOrderHeader_Nav) { 
        statusValue = binding.StockTransportOrderHeader_Nav.DocumentStatus;
        let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
        if (plant === binding.StockTransportOrderHeader_Nav.SupplyingPlant) { //Outbound doc for issues if supplying plant = user's plant
            isOutbound = true;
        }
    } else if (binding.PhysicalInventoryDocHeader_Nav) { 
        return piStatus(clientAPI, binding.PhysicalInventoryDocHeader_Nav['@odata.readLink'], true).then((results) => {
            return results;
        });
    }      

    if (statusValue === 'B' || !statusValue) { //Empty status from backend will be treated as 'Open'
        statusValue = 'A'; //We will not support partial for now.  Backend will calculate this in a future release
    }

    return getStatusText(isOutbound, statusValue, clientAPI);
}

function getStatusText(isOutbound, statusValue, clientAPI) {
    if (isOutbound) {
        switch (statusValue) {
            case 'A':
                return clientAPI.localizeText('open');
            case 'B':
                return clientAPI.localizeText('outbound_document_partial');
            case 'C':
                return clientAPI.localizeText('outbound_document_completed');
        }
    } else {
        switch (statusValue) {
            case 'A':
                return clientAPI.localizeText('open');
            case 'B':
                return clientAPI.localizeText('inbound_document_partial');
            case 'C':
                return clientAPI.localizeText('inbound_document_completed');
        }
    }
    return clientAPI.localizeText('open');
}

function handleStatusValue(statusValue) {
    return statusValue === 'C' ? 'C' : 'A'; //There is no partial (B) for inbound/outbound
}
