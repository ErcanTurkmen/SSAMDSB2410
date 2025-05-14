import CommonLibrary from '../../../Common/Library/CommonLibrary';
/**
* @param {IClientAPI} context
*/
export default function ContainersSearchFilterResults(context) {
    const fcContainer = context.getControl('FormCellContainer');
    const [sortFilterValue, dateSwitch] = ['SortFilter', 'DispatchDateSwitch'].map((n) => fcContainer.getControl(n).getValue());
    const filterResults = ['ContainerIDFilter', 'ContainerStatusFilter'].map((n) => fcContainer.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    if (dateSwitch) {
        filterResults.push(CommonLibrary.GetDateIntervalFilterValueDate(context, context.evaluateTargetPath('#Page:ContainersSearchFilterPage/#ClientData'), 'ContainersSearchFilterPage', 'DispatchDate', 'DispatchDateSwitch', 'StartDateFilter', 'EndDateFilter'));
    }
    return filterResults;
}
