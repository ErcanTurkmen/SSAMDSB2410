import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceConfirmationItemObjectType(context) {
    let category = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ItemCategoryLstPkr'));
    let objectType = '';

    if (category) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${category}')`, ['ObjectType'],  '').then(result => {
            if (result.length) {
                objectType = result.getItem(0).ObjectType;
            }
            return objectType;
        });
    }

    return Promise.resolve(objectType);
}
