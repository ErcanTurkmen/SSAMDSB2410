import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function CreateTravelExpenseServiceItemNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
    S4ServiceLibrary.setServiceItemAddTravelExpence(context);
    const newBind = {
        ...context.binding,
        ProductID: 'CSSRV_02',
        ItemCategory: 'SRVE',
        QuantityUOM: 'HR',
        Currency: context.binding.Currency,
        ItemDesc: context.localizeText('travel_expense'),
    };
    context.getPageProxy().setActionBinding(newBind);
    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemCreateChangeset.action');
}
