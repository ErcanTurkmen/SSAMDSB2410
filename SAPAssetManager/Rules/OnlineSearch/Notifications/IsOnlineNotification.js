
export default function IsOnlineNotification(context) {
    return context.binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineNotification.global').getValue();
}
