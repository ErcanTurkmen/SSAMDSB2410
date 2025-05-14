import { SpecialStock } from '../Common/Library/InventoryLibrary';
import { SpecialStocksToListpickerItems } from '../IssueOrReceipt/SpecialStockListPickerItems';

export default function PhysicalInventorySpecialStockListPickerItems(context) {
    const supportedSpecialStocks = [
        SpecialStock.ConsignmentVendor,
        SpecialStock.ProjectStock,
    ];
    return SpecialStocksToListpickerItems(context, supportedSpecialStocks);
}
