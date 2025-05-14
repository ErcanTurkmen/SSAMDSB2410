
export default function MobileStatusServiceItemObjectType(clientAPI) {
    return clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
}
