
export default function IsOnlineEquipment(context) {
    if (context?.binding?.['@odata.type']) {
        return context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineEquipment.global').getValue();
    } else {
        return context.getPageProxy()?.binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineEquipment.global').getValue();
    }
}
