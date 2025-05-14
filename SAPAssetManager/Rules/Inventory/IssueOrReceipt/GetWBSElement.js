import libCom from '../../Common/Library/CommonLibrary';

export default function GetWBSElement(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'ReservationItem' || type === 'PurchaseOrderItem') {
            return context.binding.WBSElement || context.binding.StockWBSElement || '';
        }
    }
    if (data && data.project) return data.project;
    return '';
}
