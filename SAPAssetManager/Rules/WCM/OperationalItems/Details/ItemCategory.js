import libVal from '../../../Common/Library/ValidationLibrary';

export default function ItemCategory(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service','WCMItemCategories',[],`$filter=ItemCategoryCC eq '${context.binding.ItemCategoryCC}'`)
    .then(data=>{
        if (!libVal.evalIsEmpty(data.getItem(0))) {
            return `${data.getItem(0).ItemCategoryText} (${context.binding.ItemCategoryCC || '-'})`;
        }
        return '-';
    });
}
