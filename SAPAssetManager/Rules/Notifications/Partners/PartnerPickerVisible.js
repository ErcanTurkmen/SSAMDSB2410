import NotificationTypeLstPkrDefault from '../NotificationTypePkrDefault';

export default function PartnerPickerVisible(context) {
    return GetNotifPartnerDetProcsCount(context).then(notifPartnerDetProcsCount =>
        (context.getName() === 'PartnerPicker1' && IsPartnerPicker1Visible(notifPartnerDetProcsCount)) ||
        (context.getName() === 'PartnerPicker2' && IsPartnerPicker2Visible(notifPartnerDetProcsCount)));
}

export function GetNotifPartnerDetProcsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', `$orderby=PartnerFunction&$filter=NotifType eq '${NotificationTypeLstPkrDefault(context)}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`);
}

export function IsPartnerPicker1Visible(notifPartnerDetProcsCount) {
    return 0 < notifPartnerDetProcsCount;
}
export function IsPartnerPicker2Visible(notifPartnerDetProcsCount) {
    return 1 < notifPartnerDetProcsCount;
}
