import {ValueIfExists} from '../../Common/Library/Formatter';

export default function GetItemCategory(context) {
    const binding = context.binding;
    if (binding && binding.ItemCategory) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ItemCategories', [], `$filter=ItemCategory eq '${binding.ItemCategory}'`).then(result => {
            if (result.length > 0) {
                const vendor = result.getItem(0);
                return `${vendor.ItemCategory} - ${vendor.ItemCategoryDesc}`;
            } else {
                return binding.ItemCategory;
            }
        });
    }
    return ValueIfExists(binding.ItemCategory);
}
