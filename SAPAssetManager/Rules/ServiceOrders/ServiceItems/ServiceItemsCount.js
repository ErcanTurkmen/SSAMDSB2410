import S4ServiceLibrary from '../S4ServiceLibrary';
import Logger from '../../Log/Logger';

export default function ServiceItemsCount(context) {
    return S4ServiceLibrary.countAllS4ServiceItems(context).then(count => {
            return context.formatNumber(count,'',{minimumFractionDigits : 0});
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryServiceOrderItem.global').getValue(), `count error: ${error}`);
            return context.formatNumber(0,'',{minimumFractionDigits : 0});
        });
}
