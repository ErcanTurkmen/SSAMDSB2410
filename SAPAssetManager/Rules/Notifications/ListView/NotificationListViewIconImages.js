import libCommon from '../../Common/Library/CommonLibrary';
import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';


export default function NotificationListViewIconImages(context) {
    const iconImage = [];
    
    // check if this Notification has any docs
    const docIcon = AttachedDocumentIcon(context, context.binding.NotifDocuments);
    if (docIcon) {
        iconImage.push(docIcon);
    }

    const {Tasks, Items, Activities} = context.binding;

    const localTasksExist = getLocalTasks(Tasks);
    const localItemsExist = getLocalItems(Items);
    const localActivitiesExist = getActivities(Activities);

    // check if this Notification has been locally created
    const isNotificationCreatedLocally = checkIsNotificationCreatedLocally(context, localTasksExist, localItemsExist, localActivitiesExist);
    if (isNotificationCreatedLocally) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        return iconImage;
    }

    // Check for local changes to tasks, causes, and activities at the item level only if the previous check at notification level has not passed
    if (Items) {
        for (const element of Items) {
            const localItemTasksExist = element.ItemTasks.some(task => task['@sap.isLocal']);
            const localItemCausesExist = element.ItemCauses.some(cause => cause['@sap.isLocal']);
            const localItemActivitiesExist = element.ItemActivities.some(activity => activity['@sap.isLocal']);
            if (localItemTasksExist || localItemCausesExist || localItemActivitiesExist) {
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return iconImage;
            }
        }
    }

    return iconImage;
}

function getLocalTasks(Tasks) {
    return Tasks && Tasks.some(task => task['@sap.isLocal']);
}

function getLocalItems(Items) {
    return Items && Items.some(item => item['@sap.isLocal']);
}

function getActivities(Activities) {
    return Activities && Activities.some(activity => activity['@sap.isLocal']);
}

function checkIsNotificationCreatedLocally(context, localTasksExist, localItemsExist, localActivitiesExist) {
    return libCommon.getTargetPathValue(context, '#Property:@sap.hasPendingChanges') || libCommon.getTargetPathValue(context, '#Property:NotifMobileStatus_Nav/#Property:@sap.isLocal') || libCommon.getTargetPathValue(context, '#Property:HeaderLongText/#Property:0/#Property:@sap.isLocal') || localTasksExist || localItemsExist || localActivitiesExist;
}
