import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function WorkOrderMobileStatusFilter(context) {
    return MobileStatusLibrary.getMobileStatusFilterOptions(context, context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue());
}
