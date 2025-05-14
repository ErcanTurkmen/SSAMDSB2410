import FilterSettings from './FilterSettings';
import EquipmentListFilterResults from '../Equipment/EquipmentListFilterResults';
import libCom from '../Common/Library/CommonLibrary';
import { GetConfirmationListFilterCriteria } from '../Confirmations/List/Filter/ConfirmationListFilterResults';
import ExpensesListFilterResults from '../Expenses/ExpensesListFilterResults';
import FSMFilteringResult from '../Forms/FSM/FSMFilteringResult';
import FLOCFilteringResult from '../FunctionalLocation/FLOCFilteringResult';
import { GetInventorySearchFilterCriteria } from '../Inventory/Search/InventorySearchFilterResults';
import { GetStockSearchFilterCriteria } from '../Inventory/Stock/StockSearchFilterResults';
import { GetNotificationListFilterCriteria } from '../Notifications/NotificationListFilterResults';
import { GetServiceOrderListFilterCritetia } from '../ServiceOrders/ListView/Filter/ServiceOrderListFilterResults';
import { GetServiceRequestListFilterCriteria } from '../ServiceOrders/ListView/Filter/ServiceRequestListFilterResults';
import { GetServiceItemListFilterCriteria } from '../ServiceOrders/Item/Filter/ServiceItemListFilterResults';
import SafetyCertificatesListViewFilterResults from '../WCM/SafetyCertificates/SafetyCertificatesListViewFilterResults';
import WorkApprovalsListViewFilterResults from '../WCM/WorkApprovals/List/WorkApprovalsListViewFilterResults';
import WorkPermitFilterResults from '../WCM/WorkPermitFilter/WorkPermitFilterResults';
import OperationalItemsFilterResult from '../WCM/OperationalItems/ListView/OperationalItemsFilterResult';
import { GetWorkOrderListFilterCriteria } from '../WorkOrders/WorkOrderListFilterResults';
import { GetInspectionLotListFilterCriteria } from '../WorkOrders/InspectionLot/InspectionLotListFilterResults';
import { GetWorkOrderOperationListFilterCriteria } from '../WorkOrders/Operations/WorkOrderOperationListFilterResults';
import { GetSubOperationsListFilterCriteria } from '../WorkOrders/SubOperationsListFilterResults';
import ContainersSearchFilterResults from '../FL/Containers/ListView/ContainersSearchFilterResults';
import VoyagesSearchFilterResults from '../FL/Voyages/VoyagesSearchFilterResults';
import PackagesSearchFilterResults from '../FL/Packages/ListView/PackagesSearchFilterResults';
import HUDelItemsSearchFilterResults from '../FL/HUDelItems/ListView/HUDelItemsSearchFilterResults';
import ServiceQuotationsFilterResult from '../ServiceQuotations/List/Filter/ServiceQuotationsFilterResult';

export default async function SaveFilterAsDefault(context) {
    const pageProxy = context.getPageProxy();  // pageProxy of the filter page
    const pageName = libCom.getPageName(pageProxy);
    let filterResults;

    switch (pageName) {
        case 'EquipmentFilterPage':
            filterResults = await EquipmentListFilterResults(pageProxy);
            break;
        case 'ConfirmationListFilterPage':
            filterResults = GetConfirmationListFilterCriteria(pageProxy);
            break;
        case 'DocumentFilterPage':
            filterResults = [context.evaluateTargetPath('#Page:DocumentFilterPage/#Control:SortFilter/#Value')];
            break;
        case 'SubEquipmentFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:SubEquipmentFilterPage/#Control:StatusFilter/#Value'),
            ];
            break;
        case 'ExpensesFilterPage':
            filterResults = ExpensesListFilterResults(pageProxy);
            break;
        case 'FSMFilterPage':
            filterResults = FSMFilteringResult(pageProxy);
            break;
        case 'RouteFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:RouteFilterPage/#Control:SortFilter/#Value'),
                context.evaluateTargetPath('#Page:RouteFilterPage/#Control:MobileStatusFilter/#Value'),
            ];
            break;
        case 'FunctionalLocationFilterPage':
            filterResults = await FLOCFilteringResult(pageProxy);
            break;
        case 'InventorySearchFilterPage':
            filterResults = GetInventorySearchFilterCriteria(pageProxy);
            break;
        case 'StockSearchFilter':
            filterResults = GetStockSearchFilterCriteria(pageProxy);
            break;
        case 'MeasuringPointsListFilterPage':
            filterResults = [
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:CounterFilter/#Value'),
                context.evaluateTargetPath('#Page:MeasuringPointsListFilterPage/#Control:ValCodeFilter/#Value'),
            ];
            break;
        case 'NotificationFilterPage':
            filterResults = GetNotificationListFilterCriteria(pageProxy);
            break;
        case 'ServiceOrderFilterPage':
            filterResults = GetServiceOrderListFilterCritetia(pageProxy);
            break;
        case 'ServiceRequestFilterPage':
            filterResults = GetServiceRequestListFilterCriteria(pageProxy);
            break;
        case 'ServiceItemFilterPage':
            filterResults = GetServiceItemListFilterCriteria(pageProxy);
            break;
        case 'SafetyCertificatesFilterPage':
            filterResults = SafetyCertificatesListViewFilterResults(context);
            break;
        case 'WorkApprovalsFilterPage':
            filterResults = WorkApprovalsListViewFilterResults(context);
            break;
        case 'WorkPermitsFilterPage':
            filterResults = WorkPermitFilterResults(context);
            break;
        case 'OperationalItemsListFilter':
            filterResults = OperationalItemsFilterResult(context);
            break;
        case 'WorkOrderFilterPage':
            filterResults = GetWorkOrderListFilterCriteria(pageProxy);
            break;
        case 'InspectionLotFilterPage':
            filterResults = GetInspectionLotListFilterCriteria(pageProxy);
            break;
        case 'WorkOrderOperationsFilterPage':
            filterResults = GetWorkOrderOperationListFilterCriteria(pageProxy);
            break;
        case 'PRTDocumentFilterPage':
            filterResults = [context.evaluateTargetPath('#Page:PRTDocumentFilterPage/#Control:SortFilter/#Value')];
            break;
        case 'SubOperationsFilterPage':
            filterResults = GetSubOperationsListFilterCriteria(pageProxy);
            break;
        case 'VoyagesSearchFilter':
            filterResults = VoyagesSearchFilterResults(pageProxy);
            break;
        case 'HUDelItemsFilterPage':
            filterResults = HUDelItemsSearchFilterResults(pageProxy);
            break;
        case 'ContainersSearchFilterPage':
            filterResults = ContainersSearchFilterResults(pageProxy);
            break;
        case 'PackagesSearchFilterPage':
            filterResults = PackagesSearchFilterResults(pageProxy);
            break;
        case 'ServiceQuotationsFilterPage':
        case 'ServiceQuotationItemsFilterPage':
            filterResults = ServiceQuotationsFilterResult(pageProxy);
            break;
        default:
            filterResults = [];
    }

    await FilterSettings.onSettingsSave(context, filterResults);
}
