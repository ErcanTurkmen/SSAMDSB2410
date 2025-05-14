import deleteMessage from '../../Common/DeleteEntityOnSuccess';
import Logger from '../../Log/Logger';

export default async function CheckRelatedWorkOrders(context) {
    await checkWorkOrderHistories(context);
    await checkWorkOrderGeometry(context);
    await checkLinkedHeaderNotification(context);
    return deleteMessage(context);
}

async function checkWorkOrderHistories(context) {
    const histories = await context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkOrderHistories', [], `$filter=sap.islocal() and OrderId eq '${context.binding.OrderId}' and ReferenceType eq 'P'`).then(results => results.length ? results : []);

    if (histories.length) {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/RelatedWorkOrders/RelatedWorkOrderDiscard.action');
    }

    return Promise.resolve();
}

async function checkLinkedHeaderNotification(context) {
    const notifications = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], `$filter=sap.islocal() and OrderId eq '${context.binding.OrderId}'`).then(results => results.length ? results : []);

    if (notifications.length) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateWorkOrderId.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'MyNotificationHeaders',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': notifications.getItem(0)['@odata.readLink'],
                },
                'Properties': {
                    'OrderId': '',
                },
                'UpdateLinks': [],
                'OnSuccess': '',
            },
        });
    }

    return Promise.resolve();
}

async function checkWorkOrderGeometry(context) {
    try {
        await DeleteGeometry(context, 'MyWorkOrderGeometries', 'OrderId');
        await DeleteGeometry(context, 'Geometries', 'ObjectKey');
    } catch (error) {
        Logger.error('WorkOrderDeleteGeometry', error);
        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
    }

    return Promise.resolve();
}

async function DeleteGeometry(context, entitySet, keyPropertyName) {
    const geometries = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], `$filter=sap.islocal() and ${keyPropertyName} eq '${context.binding.OrderId}'`).then(results => results.length ? results : []);
    const deleteActions = [];

    geometries.forEach(geometry => {
        deleteActions.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/Geometries/GeometryDelete.action',
            'Properties': {
                'Target': {
                    'EntitySet': entitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': geometry['@odata.readLink'],
                },
            },
        }));
    });

    return Promise.all(deleteActions);
}
