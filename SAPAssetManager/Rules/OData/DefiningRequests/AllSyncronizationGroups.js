import appSettings from '../../Common/Library/ApplicationSettings';
import libVal from '../../Common/Library/ValidationLibrary';

export default function AllSyncronizationGroups(context) {
    let definingRequests = [];

    if (!context.isDemoMode()) {
        let count = appSettings.getNumber(context, 'SyncGroupCount');

        if (libVal.evalIsNumeric(count)) {
            for (let index = 0; index < count; index++) {
                let entitysetName = appSettings.getString(context, 'SyncGroup-'+index);
                definingRequests.push({
                    'Name': entitysetName,
                    'Query': entitysetName,
                });
            }
        }
    }

    return definingRequests;
}
