
export default function RejectOrderFieldName(context) {
    let businessObject = context.binding;

    switch (businessObject['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
        case '#sap_mobile.MyWorkOrderOperation':
            return context.localizeText('workorder');
        case '#sap_mobile.S4ServiceOrder':
        case '#sap_mobile.S4ServiceItem':
            return context.localizeText('serviceorder');
    }

    return '';
}
