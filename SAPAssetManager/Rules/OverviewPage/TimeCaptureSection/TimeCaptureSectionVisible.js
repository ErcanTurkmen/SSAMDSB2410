import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';

/**
* Visibility rule for timecapture section if any feature enabled
* @param {IClientAPI} context
*/
export default function TimeCaptureSectionVisible(context) {
    return ConfirmationsIsEnabled(context) || TimeSheetsIsEnabled(context);
}
