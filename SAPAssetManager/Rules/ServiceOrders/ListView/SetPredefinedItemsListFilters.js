import ODataDate from '../../Common/Date/ODataDate';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';

export default function SetPredefinedItemsListFilters(context, status, defaultDates) {
    if (IsS4ServiceIntegrationEnabled(context)) {
        let clientData = context.evaluateTargetPath('#Page:ServiceItemsListViewPage/#ClientData');

        if (clientData) {
            clientData.predefinedStatus = status;
        }
    } else {
        let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
        const { lowerBound, upperBound } = defaultDates;

        clientData.ScheduledEarliestStartDateSwitch = true;
        clientData.ScheduledEarliestStartDateStartFilter = new ODataDate(lowerBound).toLocalDateString();
        clientData.ScheduledEarliestStartDateEndFilter = new ODataDate(upperBound).toLocalDateString();
        clientData.predefinedStatus = status;
    }
}
