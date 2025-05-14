import nilGuid from '../../Common/nilGuid';
import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';

export default function GetServiceQuotationCategory3(context) {
    let value = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category3LstPkr');

    return value || nilGuid();
}
