
export default function IsOnlineFunctionalLocation(context) {
    return context.binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineFunctionalLocation.global').getValue();
}
