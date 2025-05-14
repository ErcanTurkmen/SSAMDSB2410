/**
 * Get the object specific query if one exists for a list of functional locations under a parent object
 * @param {*} context 
 * @returns 
 */
export default function flocFilterByType(context) {
    const binding = context.getPageProxy().binding || {};

    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue()) {
    return `(WorkOrderHeader/any( wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderOperation/any(wo: wo/OrderId eq '${binding.OrderId}' ) or WorkOrderSubOperation/any( wo: wo/OrderId eq '${binding.OrderId}'))`;
    }
    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()) {
        return `(S4RefObject_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' and (so/ItemNo eq null or so/ItemNo eq '000000')))`; //Header only, no item
    }
    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue()) {
        return `(S4RequestRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
    }
    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue()) {
        return `(S4ServiceConfirmationRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' ))`;
    }
    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue()) {
        return `(S4RefObject_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' and so/ItemNo eq '${binding.ItemNo}' ))`;
    }
    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceQuotation.global').getValue()) {
        return `(S4QuotRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}' and (so/ItemNo eq null or so/ItemNo eq '000000')))`;
    }

    return '';
}
