import ZExecuteActionWithAutoSyncWithOutSave from '../ZExecuteActionWithAutoSyncWithOutSave';

export default function ZCreateEntitySuccessMessageNoClosePageWithAutoSyncWithOutSave(context) {
    return ZExecuteActionWithAutoSyncWithOutSave(context, '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
}

