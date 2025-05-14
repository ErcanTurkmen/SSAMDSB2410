import { SpecialStock } from '../Common/Library/InventoryLibrary';
import { GetSpecialStockForPhysicalInventoryDocHeaderOrItem } from './PhysicalInventoryDocHeaderGetRelatedSpecialStock';

/** @param {IClientAPI & {binding: PhysicalInventoryDocHeader}} context */
export default function PhysicalInventoryDocHeaderIsVendorVisible(context) {
    return GetSpecialStockForPhysicalInventoryDocHeaderOrItem(context.binding) === SpecialStock.ConsignmentVendor;
}
