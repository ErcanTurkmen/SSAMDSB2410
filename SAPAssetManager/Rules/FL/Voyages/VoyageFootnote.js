import ODataDate from '../../Common/Date/ODataDate';
/**
* @param {IClientAPI} clientAPI
*/
export default function VoyageFootnote(clientAPI) {
    const plannedArrivalDate = clientAPI.binding?.PlannedArrivalDate;
    return plannedArrivalDate ? clientAPI.localizeText('fl_planned_arrival_date_x' ,[clientAPI.formatDate(new ODataDate(plannedArrivalDate).date())]) : '';
}
