import libVal from '../../Common/Library/ValidationLibrary';

/**
* Return display value for HigherLvlItem property in EDT view
* @param {IClientAPI} context 
*/
export default function ServiceItemParentItemReadOnlyValue(context) {
    // Formatting standart item No value into integer - 10, 20 etc.
    const parsedParentItem = parseInt(context.binding?.HigherLvlItem);

    return libVal.evalIsNumeric(parsedParentItem) && parsedParentItem !== 0 ?
        String(parsedParentItem) :
        '-';
}
