import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function WorkOrderHighPrioritySectionQueryOptions(clientAPI) {
    const queryOptions = "$expand=OrderMobileStatus_Nav&$filter=(Priority eq '1' or Priority eq '2')&$orderby=Priority,DueDate,OrderId&$top=4";
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(clientAPI, queryOptions);
}
