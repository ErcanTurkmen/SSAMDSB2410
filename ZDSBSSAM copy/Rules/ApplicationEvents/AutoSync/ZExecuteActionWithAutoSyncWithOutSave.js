import AutoSyncLib from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';


export default function ZExecuteActionWithAutoSyncWithOutSave(context, actionName) {
    AutoSyncLib.autoSync(context);
    return context.executeAction(actionName);
}
