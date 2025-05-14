import CommonLibrary from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from './WorkOrderLibrary';

export default function FollowOnWorkOrdersCount(context) {
    if (CommonLibrary.isDefined(context.getPageProxy().binding) && CommonLibrary.isDefined(context.getPageProxy().binding['@odata.type'])) {
        if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            let reference = context.getPageProxy().binding.OrderId; 
            return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, `$filter=ReferenceOrder eq '${reference}'`)).then(count => {
                if (count) {
                    context.getPageProxy().getClientData().Count= count;
                    return count;
                } else {
                    context.getPageProxy().getClientData().Count= 0;
                    return 0;
                }
            });
        } else {
            return 0;
        }
    } else {
        return CommonLibrary.getEntitySetCount(context, 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context)).then(count => {
            if (count) {
                context.getPageProxy().getClientData().Count= count;
                return count;
            } else {
                context.getPageProxy().getClientData().Count= 0;
                return 0;
            }
        });
    }
}
