/**
* Describe this function...
* @param {IClientAPI} context
*/
import { GoodsMovementCode } from '../Common/Library/InventoryLibrary';
export default function IsDeliveryNoteVisible(context) {
    return context.binding.TempHeader_GMCode !== GoodsMovementCode.Reversal;
}
