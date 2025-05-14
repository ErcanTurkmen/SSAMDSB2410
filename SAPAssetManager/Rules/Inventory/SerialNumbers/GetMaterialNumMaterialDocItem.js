import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function GetMaterialNumMaterialDocItem(target, arr, isSTO = false, isReceipt = false) {
    let binding = target;
    if (binding.PurchaseOrderItem_Nav) binding = binding.PurchaseOrderItem_Nav;
    else if (binding.StockTransportOrderItem_Nav) binding = binding.StockTransportOrderItem_Nav;
    // if receiving items, there's no need to see STO serials, only from Material Documents
    let newReceiptArr = [];
    const newArrApplied = isSTO && isReceipt;

    if (binding.MaterialDocItem_Nav && binding.MaterialDocItem_Nav.length) {
        binding.MaterialDocItem_Nav.forEach(materialItem => {
            if (!target['@odata.type'].includes('MaterialDocItem') || target.MaterialDocNumber + target.MatDocItem !== materialItem.MaterialDocNumber + materialItem.MatDocItem) {
                if (materialItem.SerialNum.length) {
                    if (newArrApplied) {
                        materialItem.SerialNum.forEach(serial => {
                            if (materialItem.MovementType !== MovementTypes.t101) {
                                newReceiptArr.push({
                                    SerialNumber: serial.SerialNumber || serial.SerialNum,
                                    selected: false,
                                    downloaded: true,
                                });
                            }
                        });
                    }
                    if ((!isSTO || (isSTO && materialItem.MovementType === MovementTypes.t101))) {
                        materialItem.SerialNum.forEach(serial => {
                            let descItem;
                            if (newArrApplied) {
                                descItem = newReceiptArr.find(item => item.SerialNumber === serial.SerialNum);
                            } else {
                                descItem = arr.find(item => item.SerialNumber === serial.SerialNum);
                            }
                            if (descItem) {
                                descItem.Description = materialItem.MaterialDocNumber + '/' + materialItem.MatDocItem;
                            }
                        });
                    }
                }
            }
        });
    }

    return newArrApplied ? newReceiptArr : arr;
}
