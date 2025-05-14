/**
 * Get the object specific query if one exists for a list of equipment under a parent object
 * @param {*} context 
 * @returns 
 */
export default function equipmentFilterByType(context) {
    const binding = context.getPageProxy().binding || {};

    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue()) {
        return `FuncLocIdIntern eq '${binding.FuncLocIdIntern}'`;
    }
    if (binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue()) {
        return `EquipId eq '${binding.HeaderEquipment}'`;
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
        return `(S4QuotRefObj_Nav/any(so: so/ObjectID eq '${binding.ObjectID}'and (so/ItemNo eq null or so/ItemNo eq '000000')))`;
    }

    return '';
}
