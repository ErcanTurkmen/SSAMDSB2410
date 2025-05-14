export default function EquipmentCount(sectionProxy) {
    let countPromise = null;

    if (sectionProxy.getPageProxy().binding &&
        [
            sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue(),
            sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceRequest.global').getValue(),
            sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceConfirmation.global').getValue(),
            sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceItem.global').getValue(),
            sectionProxy.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceQuotation.global').getValue(),
        ].includes(sectionProxy.getPageProxy().binding['@odata.type'])) {
        countPromise = countFromRefObjects(sectionProxy);
    } else {
        countPromise = countFromMyEquipments(sectionProxy);
    }

    return countPromise.then((count) => {
        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
        return count;
    });
}

function countFromRefObjects(sectionProxy) {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', `${sectionProxy.getPageProxy().binding['@odata.readLink']}/RefObjects_Nav`, "$filter=EquipID ne null and EquipID ne ''");
}

function countFromMyEquipments(sectionProxy) {
    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', '');
}
