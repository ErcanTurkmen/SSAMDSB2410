import IsS4SidePanelEnabled from '../SideDrawer/IsS4SidePanelEnabled';
import workorderCount from '../WorkOrders/WorkOrdersCount';
import getFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import Logger from '../Log/Logger';

export default function ServiceOrdersCount(context) {
    if (IsS4SidePanelEnabled(context)) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders')
            .then(count => {
                return context.formatNumber(count,'',{minimumFractionDigits : 0});
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceOrder.global').getValue(), `count error: ${error}`);
                return context.formatNumber(0,'',{minimumFractionDigits : 0});
            });
    } else {
        return getFSMQueryOption(context).then(queryOptions => {
            return workorderCount(context, '$filter=' + queryOptions).then(result => {
                return context.formatNumber(result,'',{minimumFractionDigits : 0});
            });
        });
    }
}
