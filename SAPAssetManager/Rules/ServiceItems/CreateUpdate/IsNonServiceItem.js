import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function IsNonServiceItem(context) {
    let isNonServiceItem = false;
    let serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        if (context.binding.ItemCategory_Nav) {
            isNonServiceItem = !serviceItemCategories.includes(context.binding.ItemCategory_Nav.ObjectType);
        } else if (context.binding.ItemObjectType) {
            isNonServiceItem = !serviceItemCategories.includes(context.binding.ItemObjectType);
        }
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem') {
        if (context.binding.ItemCategory) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${context.binding.ItemCategory}')`, ['ObjectType'],  '').then(result => {
                if (result.length) {
                    isNonServiceItem = !serviceItemCategories.includes(result.getItem(0).ObjectType);
                }
                return isNonServiceItem;
            });
        }
    } else {
        let itemCategory;
        try {
            const itemCategoryProxy = CommonLibrary.getControlProxy(context, 'ItemCategoryLstPkr');
            itemCategory = itemCategoryProxy && CommonLibrary.getControlValue(itemCategoryProxy);
        } catch (err) {
            // if list picker wasn't rendered yet - taking value from binding
            itemCategory = context.binding.ItemCategory;
        }

        if (itemCategory) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${itemCategory}')`, [], '$select=ObjectType').then(result => {
                if (result.length && result.getItem(0).ObjectType) {
                    isNonServiceItem = !serviceItemCategories.includes(result.getItem(0).ObjectType);
                }

                return isNonServiceItem;
            });
        }
    }

    return Promise.resolve(isNonServiceItem);
}
