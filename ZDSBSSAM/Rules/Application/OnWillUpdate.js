/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
export default function OnWillUpdate(clientAPI) {
    return clientAPI.executeAction('/ZDSBSSAM/Actions/Application/OnWillUpdate.action').then((result) => {
        if (result.data) {
            let close_DEST_SAM2410_ONLINE_PPROP = clientAPI.executeAction('/ZDSBSSAM/Actions/DEST_SAM2410_ONLINE_PPROP/Service/CloseOffline.action');
            let close_DEST_SAM2410_PPROP = clientAPI.executeAction('/ZDSBSSAM/Actions/DEST_SAM2410_PPROP/Service/CloseOffline.action');
            return Promise.all([close_DEST_SAM2410_ONLINE_PPROP, close_DEST_SAM2410_PPROP]).then(() => {
                Promise.resolve();
            }).catch((err) => {
                Promise.reject('Offline Odata Close Failed ' + err.message);
            });
        } else {
            return Promise.reject('User Deferred');
        }
    });
}