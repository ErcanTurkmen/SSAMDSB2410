
export default function SubOperationsListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:SubOperationsListViewPage/#ClientData');
    let filterResults = GetSubOperationsListFilterCriteria(context);
    const mobileStatusFilter = filterResults.find(c => c.name === 'SubOpMobileStatus_Nav/MobileStatus');

    if (clientData.SubOperationFastFiltersClass) {
        filterResults = filterResults.concat(clientData.SubOperationFastFiltersClass.getFastFilterValuesFromFilterPage(context, mobileStatusFilter.filterItems));
    }

    return filterResults;
}

export function GetSubOperationsListFilterCriteria(context) {
    let result1 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:SubOperationsFilterPage/#Control:MySubOperationsFilter/#Value');

    let filterResults = [result1, result2, result3];

    return filterResults;
}
