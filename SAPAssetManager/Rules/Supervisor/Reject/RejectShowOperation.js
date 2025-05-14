
export default function RejectShowOperation(context) {
    let businessObject = context.binding;
    return (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' || businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem');
}
