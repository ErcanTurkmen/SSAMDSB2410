import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import libComm from '../../Common/Library/CommonLibrary';
import WorkOrdersListViewNav from '../../WorkOrders/WorkOrdersListViewNav';
import OperationsListViewWithResetFiltersNav from '../../WorkOrders/Operations/OperationsListViewWithResetFiltersNav';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import OperationsListViewNav from '../../WorkOrders/SubOperations/SubOperationsListViewNav';
import libPersona from '../../Persona/PersonaLibrary';

export default function MyWorkSectionSeeAll(context) {
    if (libPersona.isFieldServiceTechnician(context)) { 
        if (IsOperationLevelAssigmentType(context)) {
            //My Operation list view nav
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action');
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //SupOpertaion list view nav
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationsListViewNav.action');
        } else {
            //My Work Order list view nav
            let actionBinding = {
                isInitialFilterNeeded: true,
            };
            context.getPageProxy().setActionBinding(actionBinding);
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
        }
    } else {
        if (IsOperationLevelAssigmentType(context)) {
            //My Operation list view nav
            libComm.setStateVariable(context, 'MyOperationListView', true);
            return OperationsListViewWithResetFiltersNav(context);
        } else if (IsSubOperationLevelAssigmentType(context)) {
            //SupOpertaion list view nav
            libComm.setStateVariable(context, 'MySubOperationListView', true);
            return OperationsListViewNav(context);
        } else {
            //My Work Order list view nav
            libComm.setStateVariable(context, 'MyWorkOrderListView', true);
            return WorkOrdersListViewNav(context);
        }
    }
}
