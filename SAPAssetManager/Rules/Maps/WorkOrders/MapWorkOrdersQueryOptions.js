import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function MapWorkOrdersQueryOptions(context) {
    const queryOptions = '$expand=WOGeometries/Geometry,OrderMobileStatus_Nav,MarkedJob&$filter=WOGeometries/any(wg:sap.entityexists(wg/Geometry))';
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
}
