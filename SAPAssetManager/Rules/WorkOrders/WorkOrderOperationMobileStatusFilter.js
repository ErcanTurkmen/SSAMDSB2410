import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';

export default function WorkOrderOperationMobileStatusFilter(context) {
    return MobileStatusLibrary.getMobileStatusFilterOptions(context, context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue());
}
