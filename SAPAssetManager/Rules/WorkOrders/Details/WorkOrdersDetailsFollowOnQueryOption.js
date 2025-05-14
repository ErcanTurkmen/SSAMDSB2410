import { WorkOrderLibrary as libWo} from '../WorkOrderLibrary';

export default function WorkOrdersDetailsFollowOnQueryOption(context) {
    return libWo.attachWorkOrdersFilterByAssgnTypeOrWCM(context, libWo.WorkOrdersDetailsFollowOnQueryOption(context), true);
}
