import CommonLibrary from '../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
* Getting accessory icon for deleting local ref object connections
* Showing it only for S4 integration
* @param {IClientAPI} clientAPI
*/
export default function LocalRefObjectDeleteIcon(clientAPI) {
    return CommonLibrary.isEntityLocal(clientAPI.binding)
            && clientAPI.binding.MainObject !== 'X'
            && IsS4ServiceIntegrationEnabled(clientAPI)
        ? '$(PLT,/SAPAssetManager/Images/trashIcon.png,/SAPAssetManager/Images/trashIcon.android.png)'
        : '';
}
