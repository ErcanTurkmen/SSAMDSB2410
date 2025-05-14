import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function SalesOrganizationUnitValue(context) {
    if (!context.binding) return '-';

    const SalesRespOrg = context.binding.SalesRespOrg_Nav;
    if (SalesRespOrg) {
        return `${SalesRespOrg.ShortDescription} ${(SalesRespOrg.Description) || ''}`;
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'SalesRespOrgs', [], `$filter=SalesRespOrg eq '${context.binding.SalesRespOrg}'`).then((result) => {
            if (CommonLibrary.isDefined(result)) {
                const item = result.getItem(0);
                return ValueIfExists(`${item.ShortDescription} ${item.Description}`); 
            }
            return '-';
        });
    }
}
