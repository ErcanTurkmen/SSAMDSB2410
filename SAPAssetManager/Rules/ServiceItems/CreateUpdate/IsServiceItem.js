import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default async function IsServiceItem(context) {
    const binding = context.binding || {};
    const serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);
    
    let isServiceItem = false;
    if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        if (binding.ItemCategory_Nav) {
            isServiceItem = serviceItemCategories.includes(binding.ItemCategory_Nav.ObjectType);
        } else if (binding.ItemObjectType) {
            isServiceItem = serviceItemCategories.includes(binding.ItemObjectType);
        }
    } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem' || binding['@odata.type'] === '#sap_mobile.S4ServiceQuotationItem') {
        if (binding.ItemCategory) {
            const category = await context.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${binding.ItemCategory}')`, ['ObjectType'],  '').then(result => result.length ? result.getItem(0) : {});
            isServiceItem = serviceItemCategories.includes(category.ObjectType);
        }
    }

    return Promise.resolve(isServiceItem);
}
