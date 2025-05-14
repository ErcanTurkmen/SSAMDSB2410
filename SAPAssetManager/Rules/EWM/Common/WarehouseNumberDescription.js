
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function WarehouseNumberDescription(context) {
    const queryOptions = `$filter=WarehouseNo eq '${context.binding.WarehouseNo}'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseNums', [], queryOptions).then((result) => {
        if (!ValidationLibrary.evalIsEmpty(result)) {
            return `${context.binding.WarehouseNo} - ${result.getItem(0).Description}`;
        } else {
            return `${context.binding.WarehouseNo}`;
        }
    }).catch(() => {
        return `${context.binding.WarehouseNo}`;
    });
}
