import libCICO from '../ClockInClockOut/ClockInClockOutLibrary';
import libCom from '../Common/Library/CommonLibrary';
import libMobile from './MobileStatusLibrary';

export default function CurrentMobileStatusOverride(context, binding) {
    if (['Header', 'Operation'].includes(libCom.getWorkOrderAssnTypeLevel(context))) {
        const currentStatus = libMobile.getMobileStatusNavLink(context, binding);
        const isClockedIn = libCICO.isBusinessObjectClockedIn(context, binding) && libCICO.allowClockInOverride(context, currentStatus.MobileStatus);
        const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    
        //User is clocked in, but mobile status is not STARTED because another user has changed it.  We will use the next available statuses for STARTED
        if (isClockedIn && currentStatus.MobileStatus !== STARTED) {
            currentStatus.MobileStatus = STARTED;
            return currentStatus;
        }
    }

    return null;
}
