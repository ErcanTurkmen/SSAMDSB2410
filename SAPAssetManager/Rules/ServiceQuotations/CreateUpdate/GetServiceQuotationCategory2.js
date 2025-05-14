import nilGuid from '../../Common/nilGuid';
import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';

export default function GetServiceQuotationCategory2(context) {
    let value = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category2LstPkr');

    return value || nilGuid();
}
