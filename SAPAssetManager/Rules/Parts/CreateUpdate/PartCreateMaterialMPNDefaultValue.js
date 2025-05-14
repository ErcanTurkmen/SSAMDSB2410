/**
* Default value of Manufacturer Part Number for Part Create Update
* @param {IClientAPI} context
*/
export default function PartCreateMaterialMPNDefaultValue(context) {
    if (context.binding?.Material?.ManufacturerPartNum) {
        return context.binding?.Material?.ManufacturerPartNum;
    }
    return '';
}
