import CheckBeforeCancel from '../../Common/CheckForChangesBeforeCancel';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import TOTPCancelIsVisible from '../../DigitalSignature/TOTPCancelIsVisible';
import DocumentEditorCancelVisible from '../../Documents/DocumentEditorCancelVisible';
import DocumentEditorOnCancel from '../../Documents/DocumentEditorOnCancel';
import CheckForChangesOnExpenseCancel from '../../Expense/CreateUpdate/CheckForChangesOnExpenseCancel';
import IsCancelExpenseButtonVisible from '../../Expense/CreateUpdate/IsCancelExpenseButtonVisible';
import ConfirmExpenseListClose from '../../Expense/List/ConfirmExpenseListClose';
import FSMFormClosePageWrapper from '../../Forms/FSM/FSMFormClosePageWrapper';
import ClearStateAndExit from '../../Inventory/Fetch/ClearStateAndExit';
import IsSearchStringAvailable from '../../Inventory/Fetch/IsSearchStringAvailable';
import CloseIssueOrReceipt from '../../Inventory/IssueOrReceipt/CloseIssueOrReceipt';
import CancelCreationAction from '../../Inventory/MaterialDocument/CancelCreationAction';
import CancelPhysicalInventoryCreate from '../../Inventory/PhysicalInventory/CancelPhysicalInventoryCreate';
import CheckForChangesBeforeCancelPI from '../../Inventory/PhysicalInventory/Count/CheckForChangesBeforeCancel';
import IsNotAddAnother from '../../Inventory/PurchaseRequisition/Handlers/IsNotAddAnother';
import CheckForChangesBeforeCancelNotif from '../../Notifications/CheckForChangesBeforeCancel';
import CheckForChangesBeforeClose from '../../Notifications/CheckForChangesBeforeClose';
import CheckForChangesBeforeCancelPart from '../../Parts/CreateUpdate/CheckForChangesBeforeCancel';
import IsCancelConfirmationItemButtonVisible from '../../ServiceConfirmations/CreateUpdate/IsCancelConfirmationItemButtonVisible';
import ServiceItemCreateUpdateIsCancelButtonVisible from '../../ServiceItems/CreateUpdate/ServiceItemCreateUpdateIsCancelButtonVisible';
import CheckForChangesOnMileageCancel from '../../ServiceOrders/Mileage/CheckForChangesOnMileageCancel';
import SyncErrorCloseIsVisible from '../../Sync/SyncErrorCloseIsVisible';
import CancelCompletePageMessage from '../Complete/CancelCompletePageMessage';
import IsNotCompleteAction from '../Complete/IsNotCompleteAction';
import WorkOrderOperationCreateUpdateCancel from '../Operations/CreateUpdate/WorkOrderOperationCreateUpdateCancel';
import OperationConfirmationsCancelButton from '../Operations/OperationConfirmationsCancelButton';
import WorkOrderCreateUpdateIsCancelButtonVisible from './WorkOrderCreateUpdateIsCancelButtonVisible';
import CloseBulkIssueOrReceipt from '../../Inventory/IssueOrReceipt/BulkUpdate/CloseBulkIssueOrReceipt';
import IssueOrReceiptCreateUpdateCancelIsVisble from '../../Inventory/IssueOrReceipt/IssueOrReceiptCreateUpdateCancelIsVisble';
import ServiceItemsEDTCheckForChangesBeforeClose from '../../ServiceOrders/ServiceItems/EDT/ServiceItemsEDTCheckForChangesBeforeClose';
import CheckForChangesBeforeCancelProfileSettings from '../../UserPreferences/CheckForChangesBeforeCancel';

/**
* Android-only action to prevent use of default back navigation
* @param {IClientAPI} clientAPI
*/
export default function CancelCheckOnBackNavAndroid(clientAPI) {
    CommonLibrary.cancelDefaultBackNavigationAndroid(clientAPI);
    const pageName = CommonLibrary.getPageName(clientAPI);
    switch (pageName) {
        case 'WorkOrderOperationAddPage':
            if (WorkOrderCreateUpdateIsCancelButtonVisible(clientAPI)) {
                return WorkOrderOperationCreateUpdateCancel(clientAPI);
            }
            break;
        case 'ExpenseCreateUpdatePage':
            if (IsCancelExpenseButtonVisible(clientAPI)) {
                return CheckForChangesOnExpenseCancel(clientAPI);
            }
            break;
        case 'CreatePurchaseRequisition':
            if (IsNotAddAnother(clientAPI)) {
                return CheckForChangesBeforeCancelNotif(clientAPI);
            }
            break;
        case 'CreateDigitalSignature':
            if (IsNotCompleteAction(clientAPI)) {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
            }
            break;
        case 'NotificationUpdateMalfunctionEnd':
            if (IsNotCompleteAction(clientAPI)) {
                return CheckForChangesBeforeClose(clientAPI);
            }
            break;
        case 'NoteUpdate':
            if (IsNotCompleteAction(clientAPI)) {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            }
            break;
        case 'PassphraseTOTP':
            if (TOTPCancelIsVisible(clientAPI)) {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
            }
            break;
        case 'DocumentEditorPage':
            if (DocumentEditorCancelVisible(clientAPI)) {
                return DocumentEditorOnCancel(clientAPI);
            }
            break;
        case 'CreateUpdateServiceItemScreen':
            if (ServiceItemCreateUpdateIsCancelButtonVisible(clientAPI)) {  
                return CheckBeforeCancel(clientAPI);
            }
            break;
        case 'CreatedExpenseListPage':
            if (IsNotCompleteAction(clientAPI)) {  
                return ConfirmExpenseListClose(clientAPI);
            }
            break;
        case 'FetchOnlineDocumentsPage':
            if (IsSearchStringAvailable(clientAPI)) {  
                return ClearStateAndExit(clientAPI);
            }
            break;
        case 'WorkOrderOperationsConfirmPage':
            return OperationConfirmationsCancelButton(clientAPI);
        case 'ConfirmationsCreateUpdatePage':
        case 'CreateUpdateServiceConfirmationScreen':
        case 'SelectConfirmationPage':
        case 'NoteAdd':
        case 'TimeSheetEntryEditPage':
        case 'TimeEntryCreateUpdatePageForWO':
        case 'LAMValuesCreateUpdatePage':
            if (IsNotCompleteAction(clientAPI)) {
                return CheckBeforeCancel(clientAPI);
            }
            break;
        case 'SyncErrorDetailsPage':
        case 'ErrorArchiveDetailsAndroidPage':
            if (SyncErrorCloseIsVisible(clientAPI)) {
                return clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            }
            break;
        case 'ServiceOrderMileageAddEdit':
            if (IsNotCompleteAction(clientAPI)) {
                return CheckForChangesOnMileageCancel(clientAPI);
            }
            break;
        case 'CreateServiceConfirmationItemScreen':
        case 'CreateServiceHocConfirmationItemScreen':
        case 'SelectConfirmationItemPage':
            if (IsCancelConfirmationItemButtonVisible(clientAPI)) {
                return CheckBeforeCancel(clientAPI);
            }
            break;
        case 'NotificationAddPage':
            return CheckForChangesBeforeCancelNotif(clientAPI);
        case 'MaterialDocumentModalList':
            return CancelCreationAction(clientAPI);
        case 'PhysicalInventoryCountUpdatePage':
            return CheckForChangesBeforeCancelPI(clientAPI);
        case 'PartCreateUpdatePage':
        case 'VehiclePartCreate':
        case 'BOMCreateUpdatePage':
            return CheckForChangesBeforeCancelPart(clientAPI);
        case 'CreatedPhysicalInventoryListPage':
            return CancelPhysicalInventoryCreate(clientAPI);
        case 'InventoryMaterialDocumentCreatePage':
            return CheckForChangesBeforeClose(clientAPI);
        case 'SingleForm':
            return FSMFormClosePageWrapper(clientAPI);
        case 'IssueOrReceiptCreateUpdatePage':
            if (IssueOrReceiptCreateUpdateCancelIsVisble(clientAPI)) {
                return CloseIssueOrReceipt(clientAPI);
            }
            break;
        case 'InboundOutboundCreateUpdatePage':
            return CloseIssueOrReceipt(clientAPI);
        case 'BulkIssueOrReceiptCreate':
        case 'BulkIssueOrReceiptGenericFieldsCreate':
            return CloseBulkIssueOrReceipt(clientAPI);
        case 'CompleteOrderScreen':
            return CancelCompletePageMessage(clientAPI);
        case 'PurchaseRequisitionCreateList':
            return clientAPI.executeAction('/SAPAssetManager/Actions/Inventory/PurchaseRequisition/ConfirmCloseCreatePage.action');
        case 'PhysicalInventoryItemCreateUpdatePage':
            return clientAPI.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/ConfirmCloseItemCreate.action');
        case 'ConfirmationListFilterPage':
        case 'DocumentFilterPage':
        case 'EquipmentFilterPage':
        case 'SubEquipmentFilterPage':
        case 'FSMFilterPage':
        case 'RouteFilterPage':
        case 'FunctionalLocationFilterPage':
        case 'FetchDocumentsPage':
        case 'InspectionCharacteristicsFDCFilter':
        case 'InventorySearchFilterPage':
        case 'SearchStockOnline':
        case 'StockSearchFilter':
        case 'ContainersSearchFilterPage':
        case 'VoyagesSearchFilter':
        case 'HUDelItemsFilterPage':
        case 'PackagesSearchFilterPage':
        case 'MeasuringPointFilterPage':
        case 'MeasuringPointsListFilterPage':
        case 'NotificationFilterPage':
        case 'PartIssueCreateUpdatePage':
        case 'PartReturnPage':
        case 'ServiceOrderFilterPage':
        case 'ServiceItemFilterPage':
        case 'ServiceItemTransferPage':
        case 'ServiceRequestFilterPage':
        case 'ServiceOrderTransferPage':
        case 'OperationAssign':
        case 'WorkOrderAssign':
        case 'OperationalItemsListFilter':
        case 'WorkOrderFilterPage':
        case 'WorkOrderTransfer':
        case 'InspectionLotFilterPage':
        case 'OperationTransfer':
        case 'WorkOrderOperationsFilterPage':
        case 'PRTDocumentFilterPage':
        case 'SubOperationsFilterPage':
        case 'SubOperationTransfer':
        case 'WorkApprovalsFilterPage':
        case 'WorkPermitsFilterPage':
        case 'SafetyCertificatesFilterPage':
            return clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        case 'ErrorArchiveAndSync':
        case 'ErrorsArchivePage':
        case 'ExpensesFilterPage':
        case 'WorkTypeRequirementModal':
        case 'DocumentsListView':
            return clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        case 'ServiceItemsTableViewPage':
            return ServiceItemsEDTCheckForChangesBeforeClose(clientAPI, true);
        case 'UserProfileSettings':
            return CheckForChangesBeforeCancelProfileSettings(clientAPI);   
        default:
            return CheckBeforeCancel(clientAPI);
    }
}
