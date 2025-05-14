
/**
* Check for unsaved changes before closing or canceling a page
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsEDTCheckForChangesBeforeClose(context) {
    const confirmCloseAction = '/SAPAssetManager/Actions/Page/ConfirmClosePage.action';
    let sections = context.getPageProxy().getControls()[0].getSections();
    for (let section of sections) {
        if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
            let extension = section.getExtension();
            let values = extension.getUpdatedValues();
            if (values && values.length > 0) {
                return context.executeAction(confirmCloseAction);
            }
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
