import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import ContextMenuTable from '../ContextMenuTable';

export default function WorkOrderSubOperationObjectCellContextMenuItems(context) {
    return libWO.isWorkOrderInCreatedState(context) ? [] : ContextMenuTable(context);
}
