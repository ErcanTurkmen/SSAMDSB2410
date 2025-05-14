import GetPropertyNameForEntity from './GetPropertyNameForEntity';

export default async function CategoryPickerItems(context) {
    const entitySet = GetPropertyNameForEntity(context, 'EntitySet', 'Category'); 
    const returnValue = GetPropertyNameForEntity(context, 'ReturnValue', 'Category'); 
    const displayValue = GetPropertyNameForEntity(context, 'DisplayValue', 'Category'); 

    let pickerItems = [];
    const categories = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], `$orderby=${returnValue}`);
    categories.forEach(cat => {
        pickerItems.push({
            DisplayValue: Array.isArray(displayValue) ? `${cat[displayValue[0]]} - ${cat[displayValue[1]]}` : cat[displayValue],
            ReturnValue: cat[returnValue],
        });
    });
    
    return pickerItems;
}
