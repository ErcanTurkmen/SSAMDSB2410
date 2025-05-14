
import S4ServiceLibrary from '../../../../ServiceOrders/S4ServiceLibrary';
import ServiceQuotationLocalID from '../../../CreateUpdate/ServiceQuotationLocalID';

export default function GetServiceQuotationItemObjectID(context) {
    if (S4ServiceLibrary.isOnSQChangeset(context)) {
        return ServiceQuotationLocalID(context);
    }

    return '#Control:ServiceQuotationLstPkr/#SelectedValue';
}
