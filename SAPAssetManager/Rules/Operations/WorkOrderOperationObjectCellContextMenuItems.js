import ContextMenuTable from '../ContextMenuTable';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function WorkOrderOperationObjectCellContextMenuItems(context) {
    return libPersona.isWCMOperator(context) || libWO.isWorkOrderInCreatedState(context) ? [] : ContextMenuTable(context);
}
