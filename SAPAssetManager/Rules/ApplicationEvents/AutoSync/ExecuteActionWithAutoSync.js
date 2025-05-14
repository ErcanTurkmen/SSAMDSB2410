import AutoSyncLib from './AutoSyncLibrary';

export default function ExecuteActionWithAutoSync(context, actionName) {
    AutoSyncLib.autoSyncOnSave(context);
    return actionName ? context.executeAction(actionName) : Promise.resolve();
}
