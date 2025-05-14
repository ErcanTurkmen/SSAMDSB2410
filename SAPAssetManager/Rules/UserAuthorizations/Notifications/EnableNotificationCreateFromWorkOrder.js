import EnableNotificationCreate from './EnableNotificationCreate';
import EnableWorkOrderEdit from '../WorkOrders/EnableWorkOrderEdit';

export default function EnableNotificationCreateFromWorkOrder(clientAPI) {
    if (!EnableNotificationCreate(clientAPI)) {
        return Promise.resolve(false);
    }

    return EnableWorkOrderEdit(clientAPI);
}
