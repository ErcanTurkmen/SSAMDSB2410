import { isUserAuthorizedToCreateWO } from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import IsPMWorkOrderEnabled from '../UserFeatures/IsPMWorkOrderEnabled';
import IsGISEnabled from '../Maps/IsGISEnabled';

export default function IsQABSectionVisible(context) {
    return (IsPMWorkOrderEnabled(context) && isUserAuthorizedToCreateWO(context)) || 
            EnableNotificationCreate(context) || 
            TimeSheetsIsEnabled(context) || 
            IsAddConfirmationButtonVisible(context) || 
            IsGISEnabled(context);
}
