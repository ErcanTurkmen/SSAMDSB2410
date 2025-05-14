import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetAccountAssignmentCategory(context) {
    const binding = context.binding;
    if (binding && binding.AccAsgnCategory) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'AcctIndicators', [], `$filter=AcctIndicator eq '${binding.AccAsgnCategory}'`).then(result => {
            if (result.length > 0) {
                const vendor = result.getItem(0);
                return `${vendor.AcctIndicator} - ${vendor.AcctIndicatorDesc}`;
            } else {
                return binding.AccAsgnCategory;
            }
        });
    }
    return ValueIfExists(binding.AccAsgnCategory);
}
