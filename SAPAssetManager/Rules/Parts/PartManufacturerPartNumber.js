
export default function PartManufacturerPartNumber(context) {
    if (context.binding?.Material?.ManufacturerPartNum) {
        return context.binding?.Material?.ManufacturerPartNum;
    }
    return '-';
}
