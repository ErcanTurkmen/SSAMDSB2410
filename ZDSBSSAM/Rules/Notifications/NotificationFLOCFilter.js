import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import notif from './NotificationLibrary';

export default function NotificationFLOCFilter(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return `$filter=FuncLocIdIntern eq '${context.binding.EAMChecklist_Nav.FunctionalLocation}'&$orderby=FuncLocId`;
    }
    const iwk = libCom.getDefaultUserParam('USER_PARAM.IWK');
    const notificationAppParamPlant = libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant');
    let notificationPlanningPlant = iwk || notificationAppParamPlant || '';

    const notificationPlanningPlantQuery = notificationPlanningPlant.split(',').map((plant) => `PlanningPlant eq '${plant}'`).join(' or ');
    // DSB customisation to filter and default the WO FL when adding notification from operation else run std code
    if (notif.getAddFromOperationFlag(context)) {
        let funclocation = context.binding.binding.HeaderFunctionLocation;
        //let funclocation = libCom.getStateVariable(context, 'WorkOrderFL');
        let train = funclocation.substring(0, 6);
        train = String(train);
        if (notificationPlanningPlant) {
            let val = "$orderby=FuncLocId&$filter=(" + `${notificationPlanningPlantQuery}` + ") and startswith(FuncLocId,'" + train + "') eq true";
            return val;
        } else {
            return '&$orderby=FuncLocId';
        }
    }
    else {
        if (!libVal.evalIsEmpty(notificationPlanningPlant)) {
            return `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or ${notificationPlanningPlantQuery})`;
        } else {
            return '$orderby=FuncLocId&$filter=true';
        }
    }
}
