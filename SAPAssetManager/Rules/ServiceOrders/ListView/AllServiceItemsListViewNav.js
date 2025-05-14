import S4ServiceLibrary from '../S4ServiceLibrary';

export default function AllServiceItemsListViewNav(context) {
    S4ServiceLibrary.setServiceItemsFilterCriterias(context, []);
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action');
}
