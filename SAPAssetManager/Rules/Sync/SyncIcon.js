/**
* Get Sync State
* @param {IClientAPI} context
*/
import IsAutoSyncInProgress from './IsAutoSyncInProgress';

export default function SyncIcon(context) {
    return IsAutoSyncInProgress(context) ?
        '$(PLT, /SAPAssetManager/Images/auto-sync.pdf, /SAPAssetManager/Images/auto-sync.android.png, null, /SAPAssetManager/Images/auto-sync.windows.png)' :
        '$(PLT, /SAPAssetManager/Images/sync.pdf, /SAPAssetManager/Images/sync.android.png, null, /SAPAssetManager/Images/sync.png)';
}
