/**
 * Checks if the BOM item is categorized as a text item, based on its ItemCategory.
 * This is used in BOMDetails.page to determine if the BOM item is a text item.
 *
 * @param {Context} context - Current MDK ClientAPI context.
 * @returns {boolean} - True if the BOM item is a text item (ItemCategory is 'T'), otherwise false.
 */
export default function BOMIsItemText(context) {
    return context?.binding?.ItemCategory === 'T';
}
