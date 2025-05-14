/**
* This functions is for getting stock type description for Physical Inventory documents
* from specific entity set - PhysicalInventoryStockTypes. If no definition is found - siply returns stock type
* @param {IClientAPI} context
*/
export default function GetStockType(context, customBinding) {
    let binding = context.binding;
    if (customBinding) {
        binding = customBinding;
    }
    if (binding) {
        const stockType = binding.StockType;
        if (stockType) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryStockTypes', [], '$filter=Stocktype eq \'' + stockType + '\'').then(res => {
                if (res.length > 0) {
                    let item = res.getItem(0);
                    return `${item.Stocktype} - ${item.StockTypeText}`;
                }
                return stockType;
            });
        }
    }
    return '';
}
