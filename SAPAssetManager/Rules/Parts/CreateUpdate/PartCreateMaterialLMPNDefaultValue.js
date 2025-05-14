/**
* Default value of Long Manufacturer Part Number for Part Create Update
* @param {IClientAPI} context
*/
export default function PartCreateMaterialLMPNDefaultValue(context) {
    if (context.binding?.Material?.LongManufacturerPartNum) {
        return context.binding?.Material?.LongManufacturerPartNum;
    }
    return '';
}
