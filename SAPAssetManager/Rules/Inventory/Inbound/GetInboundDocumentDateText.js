import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetInboundDocumentDateText(clientAPI) {
    const binding = clientAPI.getBindingObject();
    let statusValue = binding.ObjectDate;

    if (binding.IMObject === 'PI') {
        statusValue = binding.PhysicalInventoryDocHeader_Nav.CountDate ? binding.PhysicalInventoryDocHeader_Nav.CountDate : binding.PhysicalInventoryDocHeader_Nav.PlanCountdate;
    }

    if (binding.MaterialDocument_Nav) {
        statusValue = binding.MaterialDocument_Nav.DocumentDate;
    }

    if (binding.ProductionOrderHeader_Nav) {
        statusValue = binding.ProductionOrderHeader_Nav.BasicStartDate;
    }

    if (binding.PurchaseOrderHeader_Nav) {
        statusValue = binding.PurchaseOrderHeader_Nav.DocumentDate;
    }

    if (binding.ReservationHeader_Nav) {
        statusValue = binding.ReservationHeader_Nav.ReservationDate;
    }

    if (!libVal.evalIsEmpty(statusValue)) {
        const date = common.dateStringToUTCDatetime(statusValue);
        const dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
