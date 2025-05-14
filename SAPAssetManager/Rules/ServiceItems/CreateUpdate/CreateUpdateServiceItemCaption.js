import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function CreateUpdateServiceItemCaption(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        if (S4ServiceLibrary.isViewModeTravelExpence(context)) {
            return context.localizeText('add_travel_expense');
        }
        return context.localizeText('add_service_order_item');
    }
    return context.localizeText('edit_service_order_item');
}
