import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function WorkOrdersDefaultQueryOptions(context) {
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context);
}
