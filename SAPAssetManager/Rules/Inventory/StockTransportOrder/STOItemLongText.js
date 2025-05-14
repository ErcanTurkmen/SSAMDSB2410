import Logger from '../../Log/Logger';
// Return Item Long text for STO item  
export default function STOItemLongText(context, item) {
    const objkey = item.StockTransportOrderId + item.ItemNum;
    const query = `$filter=ObjectKey eq '${objkey}' and TextObjType eq 'EKPO'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'StockTransportOrderHeaderLongTexts', ['TextString'], query).then(results => {
        if (results && results.length > 0) {
            return results.getItem(0).TextString;
        } else {
            return ' ';
        }
    }).catch(err => {
        Logger.error('Missing STO Text', err);
        return ' ';
    });
}
