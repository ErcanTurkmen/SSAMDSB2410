import { VoyageStatus } from '../Common/FLLibrary';

export default async function VoyageStatusPickerItems(clientAPI) {
    const statusFilters = Object.values(VoyageStatus).map(status => `VoyageStatusCodeType eq '${status}'`).join(' or ');
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyageStatusCodeTypes', [], `$filter=${statusFilters}&$orderby=Description`)
        .then((statuses) => Array.from(statuses)
        .map(status => ({
            'DisplayValue': `${status.Description}`,
            'ReturnValue': `${status.VoyageStatusCodeType}`,
        })));
}
