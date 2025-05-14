import FilterOnLoaded from '../Filter/FilterOnLoaded';

export default function SubOperationFilterOnLoaded(context) {
    let clientData = context.evaluateTargetPath('#Page:SubOperationsListViewPage/#ClientData');
    FilterOnLoaded(context); //Run the default filter on loaded
    if (clientData.SubOperationFastFiltersClass) {
        clientData.SubOperationFastFiltersClass.resetClientData(context);
        clientData.SubOperationFastFiltersClass.setFastFilterValuesToFilterPage(context);
    }
}
