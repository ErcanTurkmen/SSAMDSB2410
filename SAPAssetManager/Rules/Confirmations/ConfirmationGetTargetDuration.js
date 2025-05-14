import { getAdditionalUserFilterValue, getTimeLabel, checkEmptyStatusTextOnDisabledFeature } from '../OverviewPage/TimeCaptureSection/AnotherTechnicianFormatFunctions';
import ConfirmationTotalDuration from './ConfirmationTotalDuration';

/**
* Gets time based on enabled feature 
* @param {IClientAPI} context
*/
export default function ConfirmationGetTargetDuration(context) {
    const persNum = getAdditionalUserFilterValue(context);
    if (checkEmptyStatusTextOnDisabledFeature(context)) {
        return ' ';
    }
    return ConfirmationTotalDuration(context, undefined, undefined, persNum).then(hours => {
        return getTimeLabel(context, hours);
    });
}
