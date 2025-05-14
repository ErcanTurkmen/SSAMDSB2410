import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function MobileStatusFilter(context) {
    return MobileStatusLibrary.getMobileStatusFilterOptions(context, context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Notification.global').getValue());
}
