/**
* Describe this function...
* @param {IClientAPI} context
*/
import StockMaterialBatchQuery from './StockMaterialBatchQuery';
export default function BatchStockCount(context) { 
    return context.count('/SAPAssetManager/Services/AssetManager.service','MaterialBatchStockSet', StockMaterialBatchQuery(context)).then(count => {
        return context.localizeText('batch_x', [count]);
    }); 
}
