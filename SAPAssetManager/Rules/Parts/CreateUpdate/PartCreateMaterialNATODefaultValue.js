/**
* Default value of NATO Stock Number for Part Create Update
* @param {IClientAPI} context
*/
export default function PartCreateMaterialNATODefaultValue(context) {
    if (context.binding?.Material?.NATOStockNum) {
        return context.binding?.Material?.NATOStockNum;
    }
    return '';
}
