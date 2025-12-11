import libSearch from '../../../../SAPAssetManager/Rules/OnlineSearch/OnlineSearchLibrary';
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from '../../../../SAPAssetManager/Rules/Supervisor/isSupervisorFeatureEnabled';
import { IsOnlineEntityAvailableOffline } from '../../../../SAPAssetManager/Rules/OnlineSearch/IsOnlineEntityAvailableOffline';
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
    //return isUserHasParams && (assignedTo === '00000000' || assignedTo === '' || assignedTo === undefined) && !isAvailableOffline;
    //return isUserHasParams && !isAvailableOffline;  //DSB customization to support online work order download
    return !isAvailableOffline;  //DSB customization to support online work order download

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
            return object['@odata.type'] === '#sap_mobile.WorkOrderHeader' && isAssignAvailable;
        case '7':   //DSB customization to support assignment type 7 as 6
            return object['@odata.type'] === '#sap_mobile.WorkOrderHeader' && isAssignAvailable;        //return object['@odata.type'] === '#sap_mobile.WorkOrderOperation' && isAssignAvailable;
        case '8':
            return isSupervisorFeatureEnabled(context) && isAssignAvailable;
        default:
            return false;
    }
}
