/**
 * 
 * @param {IClientAPI} context 
 * @returns {Promise<any>} result from the chained action
 */
export default function FormCreateCloseOnComplete(context) {
    const clientData = context.evaluateTargetPath('#Page:FormRunner/#ClientData');

    if (clientData.FormData) {
        // store updated status
        clientData.FormData.PreviousStatus = clientData.FormData.Status;
        if (clientData.FormData.Status === 'Completed') {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        }
    }
}
