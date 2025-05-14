import nilGuid from '../../Common/nilGuid';
import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';

export default function GetServiceQuotationCategory4(context) {
    let value = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category4LstPkr');

    return value || nilGuid();
}
