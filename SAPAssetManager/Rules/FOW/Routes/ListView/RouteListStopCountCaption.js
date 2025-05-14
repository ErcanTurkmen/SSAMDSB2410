import libForm from '../../Common/Library/FormatLibrary';
import FSMMapQueryOptions from '../../../Maps/FSMMapQueryOptions';
import ODataDate from '../../../Common/Date/ODataDate';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function RouteListStopCountCaption(context) {
    let binding = context.binding;
    let count = (binding.Stops === undefined) ? 0 : binding.Stops.length;

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        const date = new ODataDate(new Date(binding.ScheduledStartDate));
        let dateFilter = `ScheduledStartDate eq ${date.queryString(context, 'date')}`;
        return FSMMapQueryOptions(context, dateFilter).then(queryOptions => {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOptions).then(woCount => {
                return libForm.formatRouteListStopCount(context, woCount);
            });
        });
    }

    if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        const date = new Date(binding.RequestedStart);
        const dateRange = {
            lowerBound: date,
            upperBound: date,
        };
        let queryOptions = S4ServiceLibrary.dateFilterQuery(dateRange, 'RequestedStart');
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceOrders', queryOptions).then(soCount => {
            return libForm.formatRouteListStopCount(context, soCount);
        });
    }

    return libForm.formatRouteListStopCount(context, count);
}
