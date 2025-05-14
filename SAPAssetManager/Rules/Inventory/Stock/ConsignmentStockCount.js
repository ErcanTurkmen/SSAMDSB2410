/**
* Get the Consignment count
* @param {IClientAPI} context
*/
import StockConsignmentQuery from './StockConsignmentQuery';
export default function ConsignmentStockCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service','MaterialVendorConsignmentStocks', StockConsignmentQuery(context)).then(count => {
        return context.localizeText('consignment_x', [count]);
    }); 
}
