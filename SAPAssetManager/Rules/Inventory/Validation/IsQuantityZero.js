/**
 * do not display 0 in the EntryQuantity field
 * @param {IClientAPI} context 
 * @returns empty string if value is 0
 */
export default function IsQuantityZero(context) {
    return Number(context.binding?.EntryQuantity) === 0 ? '' : context.binding.EntryQuantity;
}
