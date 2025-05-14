import nilGuid from '../../Common/nilGuid';
import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';

export default function GetServiceQuotationCategory1(context) {
    let value = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category1LstPkr');

    return value || nilGuid();
}
