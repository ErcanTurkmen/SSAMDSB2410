import EnableNotificationCreate from './EnableNotificationCreate';
import EnableWorkOrderEdit from '../WorkOrders/EnableWorkOrderEdit';

export default function EnableNotificationCreateFromWorkOrder(clientAPI) {

    //DSB customisation to disable notification create for WO
    /*if (!EnableNotificationCreate(clientAPI)) {
        return Promise.resolve(false);
    }

    return EnableWorkOrderEdit(clientAPI);
    */
   return false;
}
