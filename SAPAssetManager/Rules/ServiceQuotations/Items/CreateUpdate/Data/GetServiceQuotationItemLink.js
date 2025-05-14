import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../../../ServiceOrders/S4ServiceLibrary';

export default async function GetServiceQuotationItemLink(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        if (S4ServiceLibrary.isOnSQChangeset(context)) {
            return 'pending_2';
        }
        return 'pending_1';
    }

    return context.binding['@odata.readLink'];
}
