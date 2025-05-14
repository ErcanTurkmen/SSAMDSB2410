import { WorkOrderLibrary as libWO } from '../WorkOrderLibrary';

export default function InspectionLotWorkOrderFilterQueryOptions(context) {
    let filter = '$orderby=OrderId&$filter=sap.entityexists(EAMChecklist_Nav)';
    if (context.binding && context.binding.OrderId) {
        filter += "&$filter=OrderId eq '" + context.binding.OrderId + "'";
    }
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, filter);
}

