import CommonCheckForChangesBeforeCancel from '../../Common/CheckForChangesBeforeCancel';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

export default function CheckForChangesBeforeCancel(context) {
    return CommonCheckForChangesBeforeCancel(context).then(() => {
        AnalyticsManager.timeEntryCreateCancel();
    });
}
