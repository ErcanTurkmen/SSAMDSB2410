import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetServiceItemObjectType(context) {
    let control = CommonLibrary.getControlProxy(context, 'ItemCategoryLstPkr');
    let value = CommonLibrary.getControlValue(control);

    if (value) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${value}')`, [], '$select=ObjectType').then(result => {
            return result.length ? result.getItem(0).ObjectType : '';
        });
    } else {
        return Promise.resolve('');
    }
}
