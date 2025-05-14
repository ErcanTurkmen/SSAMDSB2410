
export default function MobileStatusServiceOrderObjectType(clientAPI) {
    return clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
}
