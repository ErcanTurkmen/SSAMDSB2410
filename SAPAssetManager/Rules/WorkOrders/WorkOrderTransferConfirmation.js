
export default function WorkOrderTransferConfirmation(context) {
    let okAction, message;
    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' || context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        okAction = '/SAPAssetManager/Rules/ServiceOrders/Status/ServiceOrderSetTransferFields.js';
        message = 'transfer_service_order';
    } else {
        okAction = '/SAPAssetManager/Rules/WorkOrders/WorkOrderSetTransferFields.js';
        message = 'transfer_workorder';
    }

    return context.executeAction(
        {
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': context.localizeText('confirm_status_change'),
                'Message': context.localizeText(message),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
                'OnOK': okAction,
            },
        },
    );
}
