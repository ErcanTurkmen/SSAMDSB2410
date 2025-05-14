import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function ServiceOrganizationUnitValue(context) {
    if (!context.binding) return '-';

    const ServiceRespOrg = context.binding.ServiceRespOrg_Nav;
    if (ServiceRespOrg) {
        return `${ServiceRespOrg.ShortDescription} ${(ServiceRespOrg.Description) || ''}`;
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceRespOrgs', [], `$filter=ServiceRespOrg eq '${context.binding.ServiceRespOrg}'`).then((result) => {
            if (CommonLibrary.isDefined(result)) {
                const item = result.getItem(0);
                return ValueIfExists(`${item.ShortDescription} ${item.Description}`); 
            }
            return '-';
        });
    }
}
