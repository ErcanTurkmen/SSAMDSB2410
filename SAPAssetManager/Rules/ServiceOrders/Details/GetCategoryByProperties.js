
export default function GetCategoryByProperties(context, level, schemaID, categoryID) {
    let query = `$filter=SchemaID eq '${schemaID}' and CategoryID eq '${categoryID}'`;
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', [], query).then((result) => {
        if (result.length) {
            let category = result.getItem(0);

            if (level) {
                if (category.CategoryLevel.trim() === level) {
                    return category;
                } else if (category.CategoryLevel.trim() > level && category.PareGuid !== category.CategoryGuid) {
                    query = `$filter=SchemaID eq '${schemaID}' and CategoryGuid eq guid'${category.PareGuid}'`;
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', [], query).then((result2) => {
                        let parentCategory = result2.getItem(0);
                        if (parentCategory.CategoryLevel.trim() !== level) {
                            return GetCategoryByProperties(context, level, schemaID, parentCategory.CategoryID); 
                        } else {
                            return parentCategory;
                        }
                    });
                } else {
                    return {};
                }
            }

            return category;
        }

        return {};
    });
}
