import libCom from '../../Common/Library/CommonLibrary';
/**
* This function returns the outbound delivery filter string...
* @param {IClientAPI} clientAPI
*/
export default function OutboundDeliveryFilter() {
    let plant = libCom.getUserDefaultPlant();    
    return "IMObject eq 'OB' or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant eq '" + plant + "') or IMObject eq 'RS' or IMObject eq 'PRD'";
}
