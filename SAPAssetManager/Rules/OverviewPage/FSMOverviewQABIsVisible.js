import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import { isUserAuthorizedToCreateWO } from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';

export default function FSMOverviewQABIsVisible(context) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        return true;
    } else {
        return isUserAuthorizedToCreateWO(context) || EnableNotificationCreate(context) || IsAddConfirmationButtonVisible(context);
    }
}
