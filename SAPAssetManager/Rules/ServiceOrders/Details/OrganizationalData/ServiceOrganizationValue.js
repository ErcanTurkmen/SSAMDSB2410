import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function ServiceOrganizationValue(context) {
    if (!context.binding) return '-';

    const ServiceOrg = context.binding.ServiceOrg_Nav;
    if (ServiceOrg) {
        return `${ServiceOrg.ShortDescription} ${(ServiceOrg.Description) || ''}`;
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceOrgs', [], `$filter=ServiceOrg eq '${context.binding.ServiceOrg}'`).then((result) => {
            if (CommonLibrary.isDefined(result)) {
                const item = result.getItem(0);
                return ValueIfExists(`${item.ShortDescription} ${item.Description}`); 
            }
            return '-';
        });
    }
}
