import ContextMenuTable from '../ContextMenuTable';
import libPersona from '../Persona/PersonaLibrary';
import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function WorkOrderObjectCellContextMenuItems(context) {
    return libPersona.isWCMOperator(context) || libWO.isWorkOrderInCreatedState(context) ? [] : ContextMenuTable(context);
}
