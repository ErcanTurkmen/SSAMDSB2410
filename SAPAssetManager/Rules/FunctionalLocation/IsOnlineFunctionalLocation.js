
export default function IsOnlineFunctionalLocation(context) {
    if (context?.binding?.['@odata.type']) {
        return context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineFunctionalLocation.global').getValue();
    } else {
        return context.getPageProxy()?.binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineFunctionalLocation.global').getValue();
    }
}
