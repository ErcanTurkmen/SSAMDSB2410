
export default function PartLongManufacturerPartNumber(context) {
    if (context.binding?.Material?.LongManufacturerPartNum) {
        return context.binding?.Material?.LongManufacturerPartNum;
    }
    return '-';
}
