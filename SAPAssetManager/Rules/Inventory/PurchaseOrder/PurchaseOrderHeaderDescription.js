import Logger from '../../Log/Logger';
export default function PurchaseOrderHeaderDescription(clientAPI) {
    const binding = clientAPI.getBindingObject();
    const query = `$filter=ObjectKey eq '${binding.PurchaseOrderId}' and TextObjType eq 'EKKO'`;
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderHeaderLongTexts', ['TextString'], query).then(results => {
        if (results && results.length > 0) {
            return results.getItem(0).TextString;
        } else {
            return ' ';
        }
    }).catch((err) => {
        Logger.error('No Long Text', err);
        return ' ';
    });
}
