import IsWCMOperator from '../WCM/IsWCMOperator';

export default function CreateNotificationFromSideMenuImage(context) {
    return IsWCMOperator(context) ? '$(PLT,/SAPAssetManager/Images/notifications.png,/SAPAssetManager/Images/notifications.android.png)' : '$(PLT,/SAPAssetManager/Images/add.png,/SAPAssetManager/Images/additem.android.png)';
}
