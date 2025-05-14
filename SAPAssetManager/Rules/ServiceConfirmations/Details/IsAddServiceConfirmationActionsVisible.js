import IsEditServiceConfirmationEnabled from '../../Confirmations/Details/IsEditServiceConfirmationEnabled';
import AddConfirmationToServiceItemEnabled from '../../ServiceOrders/ServiceItems/AddConfirmationToServiceItemEnabled';

export default function IsAddServiceConfirmationActionsVisible(context) {
    return AddConfirmationToServiceItemEnabled(context) || IsEditServiceConfirmationEnabled(context);
}
