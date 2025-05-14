import CommonLibrary from '../Common/Library/CommonLibrary';
import S4ServiceLibrary from './S4ServiceLibrary';

export default function ServiceOrdersByRequestNav(context) {
    CommonLibrary.setStateVariable(context, 'SERVICEORDERS_FILTER', '');
    S4ServiceLibrary.setServiceOrdersFilterCriterias(context, []);
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action');
}
