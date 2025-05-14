/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import Logger from '../../Log/Logger';
export default function STOHeaderDescription(clientAPI) {
    const binding = clientAPI.binding;
    const query = `$filter=ObjectKey eq '${binding.StockTransportOrderId}' and TextObjType eq 'EKKO'`;
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'StockTransportOrderHeaderLongTexts', ['TextString'], query).then(results => {
        if (results && results.length > 0) {
            return results.getItem(0).TextString;
        }
        return ' ';
    }).catch((err) => {
        Logger.error('No Long Text', err);
        return ' ';
    });
}
