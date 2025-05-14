/**
 * Checks if the BOM item is not categorized as a text item.
 * This is used in BOMDetails.page to determine if the BOM item is not a text item.
 *
 * @param {Context} context - Current MDK ClientAPI context.
 * @returns {boolean} - True if the BOM item is not a text item (ItemCategory is not 'T'), otherwise false.
 */
export default function BOMIsNotItemText(context) {
    return context?.binding?.ItemCategory !== 'T';
}
