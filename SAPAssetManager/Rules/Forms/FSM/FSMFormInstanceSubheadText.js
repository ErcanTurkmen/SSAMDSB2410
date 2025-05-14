import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
 * Return the correct metadata properties based on backend configuration (S4 or regular)
 * @param {*} context 
 * @returns 
 */
export default function FSMFormsInstanceSubheadText(context) {
    let s4 = IsS4ServiceIntegrationEnabled(context);
    return (s4) ? '{{#Property:S4ServiceOrderId}} - {{#Property:S4ServiceItemNumber}}': '{{#Property:WorkOrder}} - {{#Property:Operation}}';
}
