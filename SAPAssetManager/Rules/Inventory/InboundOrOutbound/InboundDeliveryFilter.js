import libCom from '../../Common/Library/CommonLibrary';
/**
* This function returns the inbound delivery filter string...
* @param {IClientAPI} context
*/
export default function InboundDeliveryFilter() {
    let plant = libCom.getUserDefaultPlant();
    let filter =  "IMObject eq 'PO' or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant ne '" + plant + "') or IMObject eq 'IB' or IMObject eq 'PRD'";  
    return filter;
}
