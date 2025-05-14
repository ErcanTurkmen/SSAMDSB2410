import CommonLibrary from '../../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function GetServiceItemParentLink(context) {
    let onChangeSet = CommonLibrary.isOnChangeset(context);
    let onSOChangeSet = S4ServiceLibrary.isOnSOChangeset(context);
    let control = CommonLibrary.getControlProxy(context, 'ServiceOrderLstPkr');
    let orderId = CommonLibrary.getControlValue(control);
    
    if (onChangeSet && onSOChangeSet) {
        return Promise.resolve('pending_1');
    } else {
        if (orderId) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', [], `$filter=ObjectID eq '${orderId}'`).then(result => {
                if (result.length) {
                    return result.getItem(0)['@odata.readLink'];
                }
    
                return '';
            });
        }
    }

    return Promise.resolve('');
}
