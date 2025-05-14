export default function MobileStatusServiceRequestObjectType(clientAPI) {
    return clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/RequestMobileStatusObjectType.global').getValue();
}
