import CommonLibrary from '../../../Common/Library/CommonLibrary';
/**
* @param {IClientAPI} context
*/
export default function PackagesSearchFilterResults(context) {
    const fcPackage = context.getControl('FormCellContainer');
    const [sortFilterValue, dateSwitch] = ['SortFilter', 'DispatchDateSwitch'].map((n) => fcPackage.getControl(n).getValue());
    const filterResults = ['ContainerIDFilter', 'ContainerStatusFilter'].map((n) => fcPackage.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    if (dateSwitch) {
        filterResults.push(CommonLibrary.GetDateIntervalFilterValueDate(context, context.getClientData(), 'PackagesSearchFilterPage', 'DispatchDate', 'DispatchDateSwitch', 'StartDateFilter', 'EndDateFilter'));
    }
    return filterResults;
}
