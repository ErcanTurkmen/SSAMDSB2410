import DocumentAddFromOperationDetails from '../../Documents/DocumentAddFromOperationDetails';
import IsAllowedExpenseCreate from '../../Expense/CreateUpdate/IsAllowedExpenseCreate';
import EnableRecordResultsFromOperationDetails from '../../InspectionCharacteristics/Update/EnableRecordResultsFromOperationDetails';
import MeasuringPointsTakeReadingsIsVisible from '../../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsPDFAllowedForOperation from '../../PDF/IsPDFAllowedForOperation';
import MileageAddIsEnabled from '../../ServiceOrders/Mileage/MileageAddIsEnabled';
import EnableNotificationCreateFromWorkOrderOperation from '../../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrderOperation';
import EnableSubOperation from '../../UserAuthorizations/WorkOrders/EnableSubOperation';
import EnableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

/**
* Check all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderOperationPopoverIsVisible(clientAPI) {
    return Promise.all([
        EnableSubOperation(clientAPI),
        EnableNotificationCreateFromWorkOrderOperation(clientAPI),
        EnableWorkOrderEdit(clientAPI),
        EnableRecordResultsFromOperationDetails(clientAPI),
        DocumentAddFromOperationDetails(clientAPI),
        IsAllowedExpenseCreate(clientAPI),
        MileageAddIsEnabled(clientAPI),
        IsPDFAllowedForOperation(clientAPI),
        MeasuringPointsTakeReadingsIsVisible(clientAPI),
    ]).then(isPopOverItemVisibleResultArray => isPopOverItemVisibleResultArray.some(i => i === true));
}
