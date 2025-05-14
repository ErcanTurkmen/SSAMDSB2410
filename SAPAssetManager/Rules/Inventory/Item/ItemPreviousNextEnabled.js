/**
 * switch state next/previous item buttons
 * @param {IClientAPI} context 
 * @param {Item} compareItem 
 * @param {Array} items 
 */
export default function ItemPreviousNextEnabled(context, compareItem, items) {
    const toolBarControls = context.getToolbarControls();
    const previousButton = toolBarControls.find(control => control.name === 'PreviousItem');
    const nextButton = toolBarControls.find(control => control.name === 'NextItem');

    previousButton.setEnabled(compareItem['@odata.id'] !== items[0]['@odata.id']);
    nextButton.setEnabled(compareItem['@odata.id'] !== items[items.length - 1]['@odata.id']);
 }

