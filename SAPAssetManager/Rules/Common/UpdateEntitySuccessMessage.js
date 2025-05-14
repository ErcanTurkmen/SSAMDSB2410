import libCom from './Library/CommonLibrary';
/**
* Function to display success message depending on the object updated
*/
export default function UpdateEntitySuccessMessage(context) {
    let objectCreatedName = libCom.getStateVariable(context, 'ObjectUpdatedName');
    libCom.setStateVariable(context, 'ObjectUpdatedName', '');

    const objectUpdatedNames = {
        'WorkOrder': 'workorder',
        'ServiceOrder': 'service_order',
        'ServiceRequest': 'service_request',
        'ServiceQuotation': 'service_quotation',
        'ServiceQuotationItem': 'service_quotation_item',
        'Notification': 'notification',
        'Signature': 'signature',
        'Item': 'item',
        'TravelExpense': 'travel_expense',
        'Reading': 'reading',
        'Document': 'document',
        'Confirmation': 'confirmation',
        'Partner': 'business_partner',
        'Reminder': 'reminder',
        'NotificationItem': 'notification_item',
        'Checklist': 'checklist',
        'Activity': 'notification_activity',
        'NotificationItemCause': 'notification_item_cause',
        'MeasurementPoint': 'point',
        'LinearData': 'linear_data',
        'Operation': 'operation',
        'NotificationTask': 'notification_task',
        'NotificationItemTask': 'notification_item_task',
        'SubOperation': 'suboperation',
        'Mileage': 'mileage',
        'Equipment': 'equipment',
        'FunctionalLocation': 'functional_location',
    };

    const objectUpdatedName = objectUpdatedNames[objectCreatedName];
    if (objectUpdatedName === undefined) {
        return context.localizeText('update_successful');
    } else {
        return context.localizeText('object_successfully_updated', [context.localizeText(objectUpdatedName)]);
    }
}
