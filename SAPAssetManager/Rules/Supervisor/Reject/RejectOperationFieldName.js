
export default function RejectOperationFieldName(context) {
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return '$(L,operation)';
    } else if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return '$(L,item)';
    }

    return '';
}
