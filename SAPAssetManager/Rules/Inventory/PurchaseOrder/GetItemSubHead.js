export default function GetItemSubHead(context) {
    const binding = context.binding;

    if (binding) {
        const itemNum = binding.ItemNum || binding.PurchaseReqItemNo;
        const plant = binding.Plant || binding.SupplyPlant || binding.PlanningPlant;
        const storageLoc = binding.StorageLoc || binding.SupplyStorageLocation || binding.StorageLocation;
        const stockType = binding.StockType || binding.RecordType;
        let plantSloc = '';

        if (plant && storageLoc) {
            plantSloc = plant + '/' + storageLoc;
        } else if (plant) {
            plantSloc = plant;
        } else if (storageLoc) {
            plantSloc = storageLoc;
        }

        if (plantSloc && stockType) {
            return itemNum + ' - ' + plantSloc + ', ' + stockType;
        } else if (plantSloc) {
            return itemNum + ' - ' + plantSloc;
        } else if (stockType) {
            return itemNum + ', ' + stockType;
        }
        return itemNum;
    }

    return '';
}
