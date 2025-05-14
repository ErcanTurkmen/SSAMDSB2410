import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetLastCategorySchemaPropertyValue(context) {
    let category1 = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'Category1LstPkr'));
    let category2 = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'Category2LstPkr'));
    let category3 = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'Category3LstPkr'));
    let category4 = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'Category4LstPkr'));

    let lastCategoryValue = [category4, category3, category2, category1].find(el => CommonLibrary.isDefined(el));

    if (CommonLibrary.isDefined(lastCategoryValue)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', [], `$filter=CategoryGuid eq guid'${lastCategoryValue}'`).then(result => {
            if (result && result.length > 0) {
                return result.getItem(0);
            }
            return {};
        });
    }

    return Promise.resolve({});
}
