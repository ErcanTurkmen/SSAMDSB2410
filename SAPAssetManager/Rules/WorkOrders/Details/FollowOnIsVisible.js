import { WorkOrderLibrary as libWO } from '../WorkOrderLibrary';

export default function FollowOnIsVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, `$filter=ReferenceOrder eq '${context.getPageProxy().binding.OrderId}'`)).then(cnt => {
        return cnt > 0; // cnt > 0 if reference orders exist (true). Else, false.
    });
}
