import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationTypeLstPkrDefault(context) {
    let defaultType = libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType');

    if (defaultType) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${defaultType}'`).then(types => {
            if (types && types.length > 0) {
                return types.getItem(0).NotifType;
            }
            return null;
        });
    }
    return null;
}
