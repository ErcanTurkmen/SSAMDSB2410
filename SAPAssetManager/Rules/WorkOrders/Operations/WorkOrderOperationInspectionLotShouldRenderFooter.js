import WorkOrderOperationInspectionLotCount from './WorkOrderOperationInspectionLotCount';

export default async function WorkOrderOperationInspectionLotShouldRenderFooter(controlProxy) {
    return (await WorkOrderOperationInspectionLotCount(controlProxy)) > 2;
}
