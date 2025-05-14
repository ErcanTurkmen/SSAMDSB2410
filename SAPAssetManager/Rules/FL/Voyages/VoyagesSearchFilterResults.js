import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* @param {IClientAPI} context
*/
export default function VoyagesSearchFilterResults(context) {
    const fcVoyage = context.getControl('FormCellContainer');
    const [sortFilterValue, dateSwitch] = ['SortFilter', 'PADateSwitch'].map((n) => fcVoyage.getControl(n).getValue());
    const filterResults = ['VoyageNumberFilter', 'ModeOfTransportFilter', 'VoyageStatusFilter','CarrierIDFilter'].map((n) => fcVoyage.getControl(n).getFilterValue());
    filterResults.push(sortFilterValue);
    if (dateSwitch) {
        filterResults.push(CommonLibrary.GetDateIntervalFilterValueDate(context, context.evaluateTargetPath('#Page:VoyagesSearchFilter/#ClientData'), 'VoyagesSearchFilter', 'PlannedArrivalDate', 'PADateSwitch', 'StartDateFilter', 'EndDateFilter'));
    }
    return filterResults;
}
