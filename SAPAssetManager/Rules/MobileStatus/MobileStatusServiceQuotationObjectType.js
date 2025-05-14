
export default function MobileStatusServiceQuotationObjectType(clientAPI) {
    return clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/QuotationMobileStatusObjectType.global').getValue();
}
