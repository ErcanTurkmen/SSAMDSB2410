/**
* Return display value for ItemNo property in EDT view
* @param {IClientAPI} context 
*/
export default function ServiceItemItemNoReadOnlyValue(context) {
    // Formatting standart item No value into integer - 10, 20 etc.
    const parsedParentItem = parseInt(context.binding?.ItemNo);

    return String(parsedParentItem);
}
