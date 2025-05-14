import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdatePartnerType(context, bindingObject, defaultNotifType = '') {
    const notifType = libCommon.IsOnCreate(context) ? defaultNotifType : bindingObject.NotificationType;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${notifType}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(result => {
        ['partnerType1', 'partnerType2'].map((name, idx) => ([name, idx < result.length ? result.getItem(idx).PartnerFunction_Nav.PartnerFunction : ''])).forEach(([name, value]) => libCommon.setStateVariable(context, name, value));
    });
}
