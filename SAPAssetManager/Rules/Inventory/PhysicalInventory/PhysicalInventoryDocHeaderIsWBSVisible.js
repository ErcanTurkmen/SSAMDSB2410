import { SpecialStock } from '../Common/Library/InventoryLibrary';
import { GetSpecialStockForPhysicalInventoryDocHeaderOrItem } from './PhysicalInventoryDocHeaderGetRelatedSpecialStock';

/** @param {IClientAPI & {binding: PhysicalInventoryDocHeader}} context */
export default function PhysicalInventoryDocHeaderIsWBSVisible(context) {
    return GetSpecialStockForPhysicalInventoryDocHeaderOrItem(context.binding) === SpecialStock.ProjectStock;
}
