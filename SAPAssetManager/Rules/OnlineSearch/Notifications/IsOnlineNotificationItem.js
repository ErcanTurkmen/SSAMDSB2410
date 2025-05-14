
export default function IsOnlineNotificationItem(context) {
    const entityType = context.binding?.['@odata.type'] || '';
    return entityType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineNotificationItem.global').getValue() || 
        entityType.includes(context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineNotificationItem.global').getValue());
}
