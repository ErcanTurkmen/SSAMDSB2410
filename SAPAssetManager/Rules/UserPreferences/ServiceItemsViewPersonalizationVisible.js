import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
* Returns if 'Item View' personalization item is visible
* @param {IClientAPI} context
*/
export default function ServiceItemsViewPersonalizationVisible(context) {
    return IsS4ServiceIntegrationEnabled(context);
}
