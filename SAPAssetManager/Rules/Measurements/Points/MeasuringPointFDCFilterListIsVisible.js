
export default function MeasuringPointFDCFilterListIsVisible(context) {

    let skipEquipment = false;
    let skipFloc = false;
    let skipOperations = false;
    let skipPRT = false;
    let skip4Items = true;

    const dataType = context.binding['@odata.type'];

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue()) {
        skipEquipment = true;
        skipFloc = true;
        skipPRT = true;
        skipOperations = true;
    }
    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue()) {
        skipFloc = true;
        skipPRT = true;
        skipOperations = true;
    }

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue()) {
        skipPRT = true;
        skipOperations = true;
        skip4Items = false;
    }

    if (dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue()) {
        skipPRT = true;
        skipOperations = true;
    }



    if (context.evaluateTargetPathForAPI('#Page:-Previous')._page.previousPage.definition.name === 'PRTListViewPage') {
        skipPRT = true;
    }

    if (context.getName() === 'Equipment') {
        let equipments = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipments;
        return (equipments?.length > 0 && !skipEquipment);
    }
    if (context.getName() === 'FuncLoc') {
        let FuncLocs = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLocs;
        return (FuncLocs?.length > 0 && !skipFloc);
    }
    if (context.getName() === 'FilterPRT') {
        return !skipPRT;
    }
    if (context.getName() === 'Operations') {
        return !skipOperations;
    }
    if (context.getName() === 'S4Items') {
        return !skip4Items;
    }
}
