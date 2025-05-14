/**
* Geting query options to get stock overview for material
* @param {IClientAPI} context
*/
export default function StockConsignmentQuery(context) {
    const binding = context.binding;
    if (binding) {
        const material = binding.MaterialNum;
        const plant = binding.Plant;
        const sloc = binding.StorageLocation;
        if (material && plant && sloc) {
            return `$filter=MaterialNum eq '${material}' and Plant eq '${plant}' and StorageLocation eq '${sloc}'&$orderby=UnrestrictedQty desc`;
        }
    }
    return "$filter=MaterialNum eq '-1'";
}
