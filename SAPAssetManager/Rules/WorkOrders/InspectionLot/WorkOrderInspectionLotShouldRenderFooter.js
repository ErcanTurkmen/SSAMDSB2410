import WorkOrderInspectionLotCount from './WorkOrderInspectionLotCount';

export default async function WorkOrderInspectionLotShouldRenderFooter(controlProxy) {
    return (await WorkOrderInspectionLotCount(controlProxy)) > 2;
}
