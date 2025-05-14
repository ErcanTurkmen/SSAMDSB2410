import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function ObjectCardTimeVisible(context) {
    let completedStatus = MobileStatusCompleted(context);
    let mobileStatus = libMobile.getMobileStatus(context.binding, context);
    let checkMobileStatus = (mobileStatus !== completedStatus);
    

    return checkMobileStatus && ((TimeSheetsIsEnabled(context) || ConfirmationsIsEnabled(context)) && !IsSubOperationLevelAssigmentType(context));
}
