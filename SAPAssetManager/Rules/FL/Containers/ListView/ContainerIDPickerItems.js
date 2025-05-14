/**
* @param {IClientAPI} context
*/
export default async function ContainerIDPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainers', [], '$orderby=ContainerID')
        .then((containers) => [... new Set(Array.from(containers, c => c.ContainerID))]
        .map(uniqueContainer => ({
            'DisplayValue': `${uniqueContainer}`,
            'ReturnValue': `${uniqueContainer}`,
        })));
}
