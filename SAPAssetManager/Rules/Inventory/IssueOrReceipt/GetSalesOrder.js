import libCom from '../../Common/Library/CommonLibrary';

export default function GetSalesOrder(context) {
    let data = libCom.getStateVariable(context, 'FixedData');
    let type;

    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.SalesOrderNumber;
        }
    }

    if (data && data.salesorder) return data.salesorder;

    return '';
}
