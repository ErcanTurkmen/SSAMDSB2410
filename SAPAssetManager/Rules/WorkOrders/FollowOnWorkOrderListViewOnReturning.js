import WOMobileLib from './MobileStatus/WorkOrderMobileStatusLibrary';
import FollowOnWorkOrderListViewCaption from './FollowOnWorkOrderListViewCaption';

export default function FollowOnWorkOrderListViewOnReturning(context) {
    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();

    return WOMobileLib.isAnyWorkOrderStarted(context).then(() => {
        return FollowOnWorkOrderListViewCaption(context).then(caption => {
            return context.setCaption(caption);
        });
    });
}
