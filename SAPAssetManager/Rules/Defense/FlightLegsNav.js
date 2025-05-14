/**
 * Set up the action binding to point at the flight legs (FlightLegs entity) for this order
 * The data may already be in the section binding, or we may need to read it
 * Modify this if the data needs to come from another source
 * @param {*} context 
 * @returns 
 */
export default async function FlightLegsNav(context) {
    context.getPageProxy().setActionBinding('');
    //Do flight legs exist in current parent section binding?  This is the default case from WO details.
    if (context._control?.parent?.binding?.Flight_Nav?.FlightLeg_Nav?.length > 0) {
        context.getPageProxy().setActionBinding(context._control.parent.binding.Flight_Nav.FlightLeg_Nav);
    } else {
        if (context.binding?.OrderId) { //Read the flight legs if we have the orderId in the binding
            let results = await context.read('/SAPAssetManager/Services/AssetManager.service', 'FlightLegs', [], `$filter=OrderId eq '${context.binding.OrderId}'&$orderby=TakeoffDate,TakeoffTime`);
            if (results && results.length > 0) {
                context.getPageProxy().setActionBinding(results);
            }
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Defense/FlightLegsNav.action');
}
