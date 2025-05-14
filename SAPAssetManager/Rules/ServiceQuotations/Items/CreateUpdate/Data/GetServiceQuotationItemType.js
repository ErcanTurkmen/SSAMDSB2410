
export default function GetServiceQuotationItemType(context) {
    return context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ServiceQuotationItemType.global').getValue();
}
