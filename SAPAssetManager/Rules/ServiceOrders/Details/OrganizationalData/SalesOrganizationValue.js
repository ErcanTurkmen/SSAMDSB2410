import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../../Common/Library/Formatter';

export default function SalesOrganizationValue(context) {
    if (!context.binding) return '-';

    const SalesOrg = context.binding.SalesOrg_Nav;
    if (SalesOrg) {
        return `${SalesOrg.ShortDescription} ${(SalesOrg.Description) || ''}`;
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'SalesOrgs', [], `$filter=SalesOrg eq '${context.binding.SalesOrg}'`).then((result) => {
            if (CommonLibrary.isDefined(result)) {
                const item = result.getItem(0);
                return ValueIfExists(`${item.ShortDescription} ${item.Description}`); 
            }
            return '-';
        });
    }
}
