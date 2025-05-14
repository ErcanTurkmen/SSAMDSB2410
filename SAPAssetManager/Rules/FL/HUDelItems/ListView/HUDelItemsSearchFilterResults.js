/**
* @param {IClientAPI} context
*/
export default function HUDelItemsSearchFilterResults(context) {
    const fcDeliveryItem = context.getControl('FormCellContainer');
    const [sortFilterValue] = ['SortFilter'].map((n) => fcDeliveryItem.getControl(n).getValue());
    const filterResults = ['MaterialFilter', 'HandlingUnitIDFilter', 'ReferenceDocNumberFilter'].map((n) => fcDeliveryItem.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    return filterResults;
}
