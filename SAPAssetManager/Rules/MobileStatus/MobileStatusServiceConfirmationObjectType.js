
export default function MobileStatusServiceOrderObjectType(clientAPI) {
    return clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ConfirmationMobileStatusObjectType.global').getValue();
}
