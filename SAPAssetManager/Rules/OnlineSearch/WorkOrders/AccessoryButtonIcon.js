import libSearch from '../OnlineSearchLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from '../../Supervisor/isSupervisorFeatureEnabled';
import { IsOnlineEntityAvailableOffline } from '../IsOnlineEntityAvailableOffline';
/**
* If device is android and entity is available for download, display download icon, otherwise no icon
* @param {IClientAPI} context
*/
export default async function AccessoryButtonIcon(context) {
    return await showAssignDependingOnAssignmentType(context) &&
        !libSearch.isCurrentListInSelectionMode(context) ?
        '$(PLT, /SAPAssetManager/Images/assign_list.png, /SAPAssetManager/Images/assign_list.android.png)' :
        '';
}

async function isAbleToAssign(context) {
    const workOrder = context.getBindingObject();
    let planningPlant, plannerGroup, mainWorkCenter, assignedTo;
    const isAvailableOffline = await IsOnlineEntityAvailableOffline(context, 'MyWorkOrderHeaders', 'OrderId');
    if (workOrder['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
        planningPlant = workOrder.PlanningPlant;
        plannerGroup = workOrder.PlannerGroup;
        mainWorkCenter = workOrder.MainWorkCenter;
        assignedTo = workOrder.AssignedTo;
    } else {
        mainWorkCenter = workOrder.MainWorkCenter;
        assignedTo = workOrder.PersonNum;
        const object = workOrder['@odata.type'] === '#sap_mobile.WorkOrderSubOperation' ? context.evaluateTargetPathForAPI('#Page:-Previous')?.getBindingObject() : workOrder;
        planningPlant = object.Header?.PlanningPlant;
        plannerGroup = object.Header?.PlannerGroup;
    }
    const isPlanningPlantMatch = libCom.getUserDefaultPlanningPlant() === planningPlant;
    const isWorkCenterMatch = libCom.getUserWorkCenters() === mainWorkCenter;
    const userPlannerGroup = libCom.getDefaultUserParam('USER_PARAM.IHG');
    const isGroupMatch = userPlannerGroup ? userPlannerGroup === plannerGroup : true;
    const isUserHasParams = isPlanningPlantMatch && isWorkCenterMatch && isGroupMatch;
    return isUserHasParams && (assignedTo === '00000000' || assignedTo === '' || assignedTo === undefined) && !isAvailableOffline;
}

export async function showAssignDependingOnAssignmentType(context) {
    const assignmentType = libCom.getWorkOrderAssignmentType(context);
    const object = context.getBindingObject();
    const isAssignAvailable = await isAbleToAssign(context);
    switch (assignmentType) {
        case '1':
            return object['@odata.type'] === '#sap_mobile.WorkOrderHeader' && isAssignAvailable;
        case '2':
            return object['@odata.type'] === '#sap_mobile.WorkOrderOperation' && isAssignAvailable;
        case '3':
            return object['@odata.type'] === '#sap_mobile.WorkOrderSubOperation' && isAssignAvailable;
        case '6':
        case '8': 
            return isSupervisorFeatureEnabled(context) && isAssignAvailable;
        default:
            return false;
    }
}
