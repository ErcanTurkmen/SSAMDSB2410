
export default function DamageLabel(context) {
    const [damage, defect] = ['damage', 'defect_type'];
    return GetDamageLabel(context, defect, damage);
}

export function GetDamageLabel(context, defect, damage) {
    let notifType = '';
    ///Check if notification object is on the binding for different odata type objects to get notification type
    if (context.binding.Notification) {
        notifType = context.binding.Notification.NotificationType;
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        ///If odata type is Notification Header use the property
        notifType = context.binding.NotificationType;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notifType}')`, [], '').then(data => {
        if (data.length > 0 && data.getItem(0).NotifCategory === '02') {
            return context.localizeText(defect);
        } else {
            return context.localizeText(damage);
        }
    });
}
