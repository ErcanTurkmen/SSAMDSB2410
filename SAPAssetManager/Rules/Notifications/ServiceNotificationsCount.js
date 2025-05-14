import notificationCount from './NotificationsTotalCount';
import getServiceNotificationTypesQueryOption from './Service/ServiceNotificationTypesQueryOption';
import IsS4SidePanelEnabled from '../SideDrawer/IsS4SidePanelEnabled';
import Logger from '../Log/Logger';

export default function SideDrawerNotificationCount(context) {
    if (IsS4SidePanelEnabled(context)) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceRequests').then(count => {
            return context.formatNumber(count,'',{minimumFractionDigits : 0});
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/ServiceRequest.global').getValue(), 'S4ServiceRequests count read error' + error);
            return context.formatNumber(0,'',{minimumFractionDigits : 0});
        });
    }

    return getServiceNotificationTypesQueryOption(context, 'NotificationType').then(serviceNotifFilter => {
        return notificationCount(context, serviceNotifFilter).then(result => {
            return context.formatNumber(result,'',{minimumFractionDigits : 0});
        });
    });
}
