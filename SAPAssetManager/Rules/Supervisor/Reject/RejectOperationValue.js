
export default function RejectOperationValue(context) {
    
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return businessObject.OperationNo + ' - ' + businessObject.OperationShortText;
    } else if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return businessObject.ItemNo + ' - ' + businessObject.ItemDesc;
    }

    return '';
}
