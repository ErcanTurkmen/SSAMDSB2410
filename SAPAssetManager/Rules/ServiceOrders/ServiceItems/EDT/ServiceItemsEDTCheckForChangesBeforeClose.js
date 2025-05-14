
/**
* Check for unsaved changes before closing or canceling a page
* @param {IClientAPI} context
* @param {boolean} [executeCloseAction=false] whether to execute close action or just return true/false
*/
export default async function ServiceItemsEDTCheckForChangesBeforeClose(context, executeCloseAction = false) {
    const extension = context.getControls()[0]?.getSections()[0]?.getExtension();
    const values = extension.getUpdatedValues();

    if (values?.length > 0) {
        const cancelConfirmed = await context.executeAction({
            Name: '/SAPAssetManager/Actions/Page/ConfirmClosePage.action',
            Properties: {
                ...(executeCloseAction ? {} : { OnOK: '' }),
            },
        }).then(result => result.data);

        return cancelConfirmed;
    }

    return executeCloseAction ?
        context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action') :
        true;
}
