
export default function RejectReasonCaption(context) {
    let businessObject = context.binding;

    switch (businessObject['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader':
            return '$(L,disapprove_workorder)';
        case '#sap_mobile.MyWorkOrderOperation':
            return '$(L,disapprove_operation)';
        case '#sap_mobile.S4ServiceOrder':
            return '$(L,reject_service_order)';
        case '#sap_mobile.S4ServiceItem':
            return '$(L,reject_service_item)';
    }

    return '';
}
