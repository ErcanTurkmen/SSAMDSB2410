import CommonCheckForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

export default function CheckForChangesBeforeClose(context) {
    return CommonCheckForChangesBeforeClose(context).then(() => {
        AnalyticsManager.timeEntryCreateCancel();
    });
}
