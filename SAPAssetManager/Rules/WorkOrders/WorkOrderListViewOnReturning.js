import WOMobileLib from './MobileStatus/WorkOrderMobileStatusLibrary';
import WorkOrderListViewSetCaption from './WorkOrderListViewSetCaption';

export default function WorkOrderListViewOnReturning(context) {
    return WOMobileLib.isAnyWorkOrderStarted(context).then(() => {
        return WorkOrderListViewSetCaption(context);
    });
}
