
export default function GetSoldToPartyType(context) {
    return context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue() || '';
}
