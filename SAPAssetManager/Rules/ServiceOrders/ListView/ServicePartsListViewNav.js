import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServicePartsListViewNav(context) {
    let categories = S4ServiceLibrary.getServiceProductPartCategories(context);
    S4ServiceLibrary.setServiceItemsFilterCriterias(context, []);
    return S4ServiceLibrary.getItemsCategoriesFilterCriteria(context, categories, context.localizeText('part')).then(filters => {
        S4ServiceLibrary.setServiceItemsFilterCriterias(context, filters);
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action');
    });
}
