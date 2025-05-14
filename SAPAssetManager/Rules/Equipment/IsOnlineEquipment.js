
export default function IsOnlineEquipment(context, binding = context.binding) {
    return binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineEquipment.global').getValue();
}
