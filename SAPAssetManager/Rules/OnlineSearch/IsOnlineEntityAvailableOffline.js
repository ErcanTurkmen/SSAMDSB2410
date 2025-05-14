
export function IsOnlineEntityAvailableOffline(context, entity, filterField) {
    const bidning = context.binding || context.getActionBinding();
    return context.count('/SAPAssetManager/Services/AssetManager.service', entity, `$filter=${filterField} eq '${bidning[filterField]}'`).then((count) => {
        return count > 0;
    })
    .catch(() => {
        return false;
    });
}
