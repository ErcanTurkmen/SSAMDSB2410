import DocumentAddFromOperationDetails from '../../../../SAPAssetManager/Rules/Documents/DocumentAddFromOperationDetails';
import IsAllowedExpenseCreate from '../../../../SAPAssetManager/Rules/Expense/CreateUpdate/IsAllowedExpenseCreate';
import EnableRecordResultsFromOperationDetails from '../../../../SAPAssetManager/Rules/InspectionCharacteristics/Update/EnableRecordResultsFromOperationDetails';
import MeasuringPointsTakeReadingsIsVisible from '../../../../SAPAssetManager/Rules/Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsPDFAllowedForOperation from '../../../../SAPAssetManager/Rules/PDF/IsPDFAllowedForOperation';
import MileageAddIsEnabled from '../../../../SAPAssetManager/Rules/ServiceOrders/Mileage/MileageAddIsEnabled';
import EnableNotificationCreateFromWorkOrderOperation from '../../../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrderOperation';
import EnableSubOperation from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableSubOperation';
import EnableWorkOrderEdit from '../../../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

/**
* Check all of the individual menu item rules and only show the menu if one of them is true
* @param {IClientAPI} clientAPI
*/
export default function WorkOrderOperationPopoverIsVisible(clientAPI) {
    if (clientAPI.binding.OperationNo === '0010') {
        return false;
    }
    else {
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
}
