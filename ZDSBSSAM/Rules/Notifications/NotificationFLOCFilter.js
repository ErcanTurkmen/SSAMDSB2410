import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import notif from './NotificationLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';

export default function NotificationFLOCFilter(context) {
    let ZIsFromOperationFlag = false;
    let query = '';
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return `$filter=FuncLocIdIntern eq '${context.binding.EAMChecklist_Nav.FunctionalLocation}'&$orderby=FuncLocId`;
    }
    const iwk = libCom.getDefaultUserParam('USER_PARAM.IWK');
    const notificationAppParamPlant = libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant');
    //let notificationPlanningPlant = iwk || notificationAppParamPlant || '';
    //let notificationPlanningPlant = notificationAppParamPlant || '';
    let notificationPlanningPlant = "";
    const notificationPlanningPlantQuery = notificationPlanningPlant.split(',').map((plant) => `PlanningPlant eq '${plant}'`).join(' or ');
    // DSB customisation to filter and default the WO FL when adding notification from operation else run std code
    //And remove filter by IWK
    if (context.binding.binding?.CurrentPageName) {
        ZIsFromOperationFlag = libCom.getStateVariable(context, 'ZNotificationFromOperation', context.binding.binding?.CurrentPageName);
    }
    if (ZIsFromOperationFlag) {
        let funclocation = context.binding.binding.HeaderFunctionLocation;
        //let funclocation = libCom.getStateVariable(context, 'WorkOrderFL');
        let train = funclocation.substring(0, 6);
        //train = String(train);
        if (train) {
            //query = "$orderby=FuncLocId&$filter=(" + `${notificationPlanningPlantQuery}` + ") and FuncLocId eq '" + train + "'";
            query = "$orderby=FuncLocId&$filter=FuncLocId eq '" + train + "'";
            //"$orderby=FuncLocId&$filter=(" + `${notificationPlanningPlantQuery}` + ") and startswith(FuncLocId,'" + train + "') eq true";
            return query;
        } else {
            return '&$orderby=FuncLocId';
        }
    }
    else {
        /*if (!libVal.evalIsEmpty(notificationPlanningPlant)) {
            return `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or ${notificationPlanningPlantQuery})`;
        } else {
            return '$orderby=FuncLocId&$filter=true';
        }*/
       return '$orderby=FuncLocId&$filter=true';
    }
}
