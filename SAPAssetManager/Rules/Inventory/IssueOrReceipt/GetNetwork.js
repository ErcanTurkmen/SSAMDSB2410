import libCom from '../../Common/Library/CommonLibrary';

export default function GetNetwork(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'PurchaseOrderItem') {
            return context.binding.Network;
        } else if (type === 'ReservationItem') {
            return context.binding.ReservationHeader_Nav.Network;
        }
    }
    if (data && data.network) return data.network;
    return '';
}
