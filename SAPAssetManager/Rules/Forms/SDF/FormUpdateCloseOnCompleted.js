/**
 * 
 * @param {IClientAPI} context 
 * @returns {Promise<any>} result from the chained action
 */
export default function FormUpdateCloseOnComplete(context) {
    const clientData = context.evaluateTargetPath('#Page:FormRunner/#ClientData');

    if (clientData.FormData) {
        // store updated status
        clientData.FormData.PreviousStatus = clientData.FormData.Status;
        if (clientData.FormData.Status === 'Completed') {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessageNoClose.action');
        }
    }
}
