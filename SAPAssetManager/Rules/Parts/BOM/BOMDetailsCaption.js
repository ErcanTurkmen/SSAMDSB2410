/**
 * Retrieves the appropriate caption for the BOM item on the detail page.
 * If the item is categorized as a text item, it returns the item's text (ItemText1).
 * Otherwise, it returns the material description (MaterialDesc).
 * This is used in BOMDetails.page to determine the caption to display for the BOM item.
 *
 * @param {Context} context - Current MDK ClientAPI context.
 * @returns {string} - The caption to display: either the item's text or material description.
 */
import BOMIsItemText from './BOMIsItemText';

export default function BOMDetailsCaption(context) {
    return BOMIsItemText(context) ? context.binding.ItemText1 : context.binding.MaterialDesc;
}
