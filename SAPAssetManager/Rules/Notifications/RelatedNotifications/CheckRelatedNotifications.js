import deleteMessage from '../../Common/DeleteEntityOnSuccess';

export default async function CheckRelatedNotifications(context) {
    const actions = [];

    const relatedNotification = await context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationHistories', [], `$filter=sap.islocal() and NotificationNumber eq '${context.binding.NotificationNumber}' and ReferenceType eq 'P'`).then(result => result.length ? result.getItem(0) : null);
    if (relatedNotification) {
        actions.push(context.executeAction('/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationDiscard.action'));
    } 

    actions.push(checkRelatedWorkOrder(context));

    return Promise.all(actions).then(() => {
        return deleteMessage(context);
    });
}

async function checkRelatedWorkOrder(context) {
    const workOrder = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=NotificationNumber eq '${context.binding.NotificationNumber}'`).then(result => result.length ? result.getItem(0) : null);
    const actions = [];

    if (workOrder) {
        actions.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderUpdateNotificationNumber.action', 
            'Properties': {
                'Target': {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': workOrder['@odata.readLink'],
                },
                'Properties': {
                    'NotificationNumber': '',
                },
                'UpdateLinks': [],
            },
        }));
    }

    const objectListsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderObjectLists', `$filter=NotifNum eq '${context.binding.NotificationNumber}' and OrderId ne ''`);
    if (objectListsCount < 0) {
        actions.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ObjectList/CreateUpdate/ObjectListDeleteNotificationForWorkOrder.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'MyWorkOrderObjectLists',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'QueryOptions': `$filter=NotifNum eq '${context.binding.NotificationNumber}' and OrderId ne ''`,
                },
            }}));
    }

    return Promise.all(actions);
}
