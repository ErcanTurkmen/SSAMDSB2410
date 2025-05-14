import libInv from '../../Common/Library/InventoryLibrary';

/**
 * Should the next button be shown on physical inventory creaate page?
 * @param {IClientAPI} context 
 * @returns true if visible
 */
export default function IsNextButtonVisible(context) {
    return libInv.getHidePhysicalInventorySummaryPage(context);
}
