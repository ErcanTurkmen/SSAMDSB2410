import ItemCategoryQueryOptions from '../../ServiceConfirmations/CreateUpdate/ItemCategoryQueryOptions';

export default function ItemCategoryPickerItems(context) {
    return ItemCategoryQueryOptions(context).then(query => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceItemCatDetermineSet', [], query).then(result => {
            let items = [];

            for (let i = 0; i < result.length; i++) {
                let item = result.getItem(i);
                let isElementExist = items.find(category => {
                    return category.ReturnValue === item.ItemCategory; 
                });

                if (!isElementExist) {
                    items.push({
                        'ReturnValue': item.ItemCategory,
                        'DisplayValue': item.ItemCategory + ' - ' + item.ShortDescriptionI,
                    });
                }
            }

            return items;
        });
    });
}
