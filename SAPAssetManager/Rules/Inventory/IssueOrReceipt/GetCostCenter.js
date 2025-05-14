import libCom from '../../Common/Library/CommonLibrary';

export default function GetCostCenter(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'PurchaseOrderItem') {
            return context.binding.CostCenter;
        } else if (type === 'ReservationItem') {
            return context.binding.ReservationHeader_Nav.CostCenter;
        }
    }
    if (data && data.cost_center) return data.cost_center;
    return '';
}
