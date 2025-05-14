import NotificationItemsCount from './NotificationItemsCount';

export default async function NotificationItemsShouldRenderFooter(controlProxy) {
    const notificationItemsCount = await NotificationItemsCount(controlProxy);

    return notificationItemsCount > (controlProxy.getName() === 'NotificationItemsDataTable' ? 4 : 2);
}
