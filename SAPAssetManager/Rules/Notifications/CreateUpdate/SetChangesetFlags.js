import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import GenerateNotificationID from '../../Notifications/GenerateNotificationID';
import NotificationLibrary from '../../Notifications/NotificationLibrary';

function notificationCreateOrItemAdd(context, notificationResults) {
    context.getClientData().notificationExists = false;
    if (notificationResults && notificationResults.length > 0) { //Notification exists. Just add new item.
        context.getClientData().notificationExists = true;
        //Set LocalNotificationID to the ID of the existing notification. This is needed for QMNotificationItemCreate.action.
        let actionBinding = context.binding;
        actionBinding.LocalNotificationID = notificationResults.getItem(0).NotificationNumber;
        context.setActionBinding(actionBinding);
        common.setOnChangesetFlag(context, false);
        return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/QMNotificationItemCreate.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/QMNotificationSuccess.action').then(() => {
                return context.executeAction('/SAPAssetManager/Rules/Common/ChangeSet/ChangeSetOnSuccess.js');
            });
        });
    } else { //Create new notification with new item
        //Set LocalNotificationID to the generated local notification ID. This is needed for NotificationQMCreateChangeSet.action.
        return GenerateNotificationID(context).then(newNotificationID => {
            let actionBinding = context.binding;
            actionBinding.LocalNotificationID = newNotificationID;
            context.setActionBinding(actionBinding);
            common.setOnChangesetFlag(context, true);
            return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationQMCreateChangeSet.action').then(() => {
                return context.executeAction('/SAPAssetManager/Rules/Common/ChangeSet/ChangeSetOnSuccess.js');
            });
        });
    }
}

export default function SetChangesetFlags(context) {
    //Temporary Workaround for an issue where the hierarchy list picker is wiping out the binding on the page. MDK issue logged MDKBUG-585.
    //Get the binding from the formcellcontainer
    let formCellContainer = context.getControl('FormCellContainer');
    if (libVal.evalIsEmpty(context.binding)) {
        context._context.binding = formCellContainer.binding;
    }
    let planningPlant = context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant;
    let orderType = context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType;

    let type = common.getListPickerValue(context.getControls()[0].getControl('TypeLstPkr').getValue());
    let notifCategoryPromise = NotificationLibrary.getNotificationCategory(context,type);

    notifCategoryPromise.then(notifCategory => {
        common.setStateVariable(context, 'NotificationType', type);
        common.setStateVariable(context, 'NotificationCategory', notifCategory);
    }).catch(() => {
        return Promise.resolve(); 
    });

    if (!libVal.evalIsEmpty(orderType) && !libVal.evalIsEmpty(planningPlant)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [],
        `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then(orderTypeResults => {
            if (orderTypeResults.getItem(0).OneQNotifPerLotFlag === 'X') {
                 //Search for existing notification by inspection lot.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [],
                `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}')`).then(result => {
                    notificationCreateOrItemAdd(context, result);
                });
            } else {
                //Search for existing notification by inspection point.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [],
                `$filter=Items/any(itm: itm/InspectionPoint_Nav/InspectionLot eq '${context.binding.InspectionLot}'
                and itm/InspectionPoint_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionPoint_Nav/SampleNum eq '${context.binding.SampleNum}')`).then(result => {
                    notificationCreateOrItemAdd(context, result);
                });
            }
        }).catch((error) => {
            Logger.error('QM', `SetChangesetFlags(context): ${error}`);
        });
    }
    Logger.error('QM', 'Planning plant and order type cannot be undefined or empty.');
}
