import ExecuteActionWithAutoSync from '../../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function DiscardReading(context) {
    let readingObject = context.getActionResult('ReadResult').data.getItem(0);

    //2 offline odata limitations here: We cannot call UndoPendingChanges on a reading if it errored out
    //We also cannot delete it from the ErrorArchive since it's a new object, the RequestURL doesn't have a readlink
    //So the only option is to delete the reading itself
    if (readingObject['@sap.inErrorState']) {
        context.getPageProxy().getClientData().binding = readingObject;
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsDiscard.action').then( () => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Meters/CreateUpdate/DiscardEntitySuccessMessage.action');
        });
    } else {
        context.getPageProxy().setActionBinding(readingObject);
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action', 'Properties': {
            'Target': {
                'EntitySet': 'MeterReadings',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'EditLink': readingObject['@odata.editLink'],
            },
            'OnSuccess': '/SAPAssetManager/Rules/ApplicationEvents/AutoSync/actions/DiscardEntitySuccessMessageWithAutoSync.js',
            'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action',
        }});
    }
}
