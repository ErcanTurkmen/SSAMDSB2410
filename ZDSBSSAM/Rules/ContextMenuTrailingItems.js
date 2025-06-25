import common from '../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from '../../SAPAssetManager/Rules/Supervisor/isSupervisorFeatureEnabled';
import EnableWorkOrderEdit from '../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import EnableNotificationEdit from '../../SAPAssetManager/Rules/UserAuthorizations/Notifications/EnableNotificationEdit';
import userFeaturesLib from '../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import ContextMenuTrailingItemsForSignature from '../../SAPAssetManager/Rules/UserAuthorizations/WorkOrders/EnableSignatureDiscard';

export default function ContextMenuTrailingItems(context) {
    let trailing = [];

    let entityType = context.binding['@odata.type'];
    let isLocal = common.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    let data = common.getBindingEntityData(context);
    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            //DSB customisation to remove Edit Wo
            if (isSupervisorFeatureEnabled(context)) {//As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return trailing;
            }

            return EnableWorkOrderEdit(context).then( isEnabled => {
                if (isEnabled) {
                    //trailing.push('Edit_WorkOrder');
                    if (isLocal) {
                        trailing.push('Delete_WorkOrder');
                    }
                }
                return trailing;
            });
        case '#sap_mobile.MyWorkOrderOperation':
            //DSB customisation to remove edit operation, add PRT equipment
            if (isSupervisorFeatureEnabled(context)) {//As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return trailing;
            }
            if (isLocal) {
                trailing = ['PRT_AddEquipment','Delete_Operation'];
            } else {
                trailing = ['PRT_AddEquipment'];
            }
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            if (isLocal) {
                trailing = ['Edit_SubOperation','Delete_SubOperation'];
            } else {
                trailing = ['Edit_SubOperation'];
            }
            break;
        case '#sap_mobile.MyNotificationHeader':
            if (EnableNotificationEdit(context)) {
                trailing.push('Edit_Notification');
                if (isLocal) {
                    trailing.push('Delete_Notification');
                }
            }
            return trailing;
        case '#sap_mobile.MyFunctionalLocation':
        case '#sap_mobile.MyEquipment':
            if (context.binding.MeasuringPoints.length > 0 && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue())) 
                trailing = ['Take_Reading'];
            else
                trailing = [];
            break;
        case '#sap_mobile.CatsTimesheetOverviewRow':
                trailing = ['Delete_Timesheet'];
            break;
        case '#sap_mobile.Confirmation':
            if (isLocal) {
                trailing = ['Delete_Confirmation'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MyFuncLocDocument':
        case '#sap_mobile.MyNotifDocument':
        case '#sap_mobile.MyEquipDocument':
        case '#sap_mobile.Document':
        case '#sap_mobile.S4ServiceOrderDocument':
            if (isLocal) {
                trailing = ['Delete_Document'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MyWorkOrderDocument':  
            if (isLocal) {
                trailing = ['Delete_Document'];
            } else {
                trailing = [];
            }
            
            //disable signatures removal after work order is completed
            if (data && data.Document && data.OrderId) {
                return ContextMenuTrailingItemsForSignature(context, data, trailing);
            }
            break;
        case '#sap_mobile.MeasurementDocument':
            if (isLocal) {
                trailing = ['Delete_MeasurementDocument'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.UserPreference':
            trailing = ['Delete_Entry'];
            break;
        case '#OfflineOData.ErrorArchiveEntity':
            trailing = ['Delete_Entry'];
            break;
        default:
            break;
    }
    return trailing;
}
