export default function FormatCategory(context) {
    let category = context.binding.FuncLocType || context.binding.FuncLocCategory;
    return context.read('/SAPAssetManager/Services/AssetManager.service', `FuncLocCategories('${category}')`, [], '').then(function(result) {
        if (result && result.getItem(0)) {
            return category + ' - ' + result.getItem(0).FuncLocCategoryDesc;
        } else {
            return '-';
        }
    }, function() {
        return category || '-';
    });
}
