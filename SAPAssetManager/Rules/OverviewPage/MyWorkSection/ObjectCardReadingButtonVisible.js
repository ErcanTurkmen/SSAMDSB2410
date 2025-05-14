import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import common from '../../Common/Library/CommonLibrary';
import MeasuringPointsTakeReadingsIsVisible from '../../Measurements/Points/MeasuringPointsTakeReadingsIsVisible';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';

export default function ObjectCardReadingButtonVisible(context) {
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue().toUpperCase());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue().toUpperCase());
    let mobileStatus;
    if (IsOperationLevelAssigmentType(context)) {
        mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
        if (mobileStatus === COMPLETE || mobileStatus === TRANSFER) {
            return false;
        }
        return MeasuringPointsTakeReadingsIsVisible(context, context.binding);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        return false;
    } else {
        mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
        if (mobileStatus === COMPLETE || mobileStatus === TRANSFER) {
            return false;
        }
        return MeasuringPointsTakeReadingsIsVisible(context, context.binding);
    }
}
