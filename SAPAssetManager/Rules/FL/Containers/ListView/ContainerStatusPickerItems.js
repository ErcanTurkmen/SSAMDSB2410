import { ContainerStatus } from '../../Common/FLLibrary';

export default async function ContainerStatusPickerItems(context) {
    const statusFilters = Object.values(ContainerStatus).map(status => `FldContainerStatus eq '${status}'`).join(' or ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerStatuses', [], `$filter=${statusFilters}&$orderby=FldContainerStatusDescription`)
        .then((containers) => [...Array.from(containers)]
        .map(container => ({
            'DisplayValue': `${container.FldContainerStatusDescription}`,
            'ReturnValue': `${container.FldContainerStatus}`,
        })));
}
