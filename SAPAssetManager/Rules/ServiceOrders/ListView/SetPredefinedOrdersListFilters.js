import ODataDate from '../../Common/Date/ODataDate';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';

export default function SetPredefinedOrdersListFilters(context, status, defaultDates) {
    const { lowerBound, upperBound } = defaultDates;
    if (IsS4ServiceIntegrationEnabled(context)) {
        let clientData = context.evaluateTargetPath('#Page:ServiceOrdersListViewPage/#ClientData');

        if (clientData) {
            clientData.reqDateSwitch = true;
            clientData.reqStartDate = new ODataDate(lowerBound).toLocalDateString();
            clientData.reqEndDate = new ODataDate(upperBound).toLocalDateString();
            clientData.predefinedStatus = status;
        }
    } else {
        let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');

        clientData.reqDateSwitch = true;
        clientData.reqStartDate = new ODataDate(lowerBound).toLocalDateString();
        clientData.reqEndDate = new ODataDate(upperBound).toLocalDateString();
        clientData.predefinedStatus = status;
    }
}
