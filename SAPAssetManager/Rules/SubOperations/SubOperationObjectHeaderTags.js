import SubOperationMobileStatus from '../MobileStatus/SubOperationMobileStatus';
import { WorkOrderLibrary as libWo } from '../WorkOrders/WorkOrderLibrary';

export default function SubOperationObjectHeaderTags(context) {
    const tags = [context.binding.ControlKey];

    const status = SubOperationMobileStatus(context);
    if (status) {
        tags.push(status);
    }
    
    return libWo.addTagsForWCMAndCreatedWorkOrder(context, tags);
}
