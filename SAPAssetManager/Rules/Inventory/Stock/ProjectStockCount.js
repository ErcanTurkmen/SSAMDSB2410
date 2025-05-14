/**
* Get Project stock count.
* @param {IClientAPI} context
*/
import StockConsignmentQuery from './StockConsignmentQuery';
export default function ProjectStockCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service','MaterialProjectStocks', StockConsignmentQuery(context)).then(count => {
        return context.localizeText('project_x', [count]);
    }); 
}
