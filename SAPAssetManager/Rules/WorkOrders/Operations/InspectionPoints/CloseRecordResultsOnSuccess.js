import libCom from '../../../Common/Library/CommonLibrary';

export default function CloseRecordResultsOnSuccess(context) {
    if (libCom.getStateVariable(context, 'CloseRecordResultsPageOnSuccess')) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            libCom.setStateVariable(context, 'CloseRecordResultsPageOnSuccess', false);
        });
    }
    return Promise.resolve();
}
