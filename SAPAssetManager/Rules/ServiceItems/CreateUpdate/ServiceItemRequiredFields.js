import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import IsFromItemsList from './IsItemCreateFromServiceItemsList';

export default function ServiceItemRequiredFields(context) {
    let requiredFields = [
        'ProductIdLstPkr',
        'ItemCategoryLstPkr',
        'DescriptionNote',
        'QuantitySimple',
    ];

    if (IsFromItemsList(context)) {
        requiredFields.push('ServiceOrderLstPkr');
    }

    if (S4ServiceLibrary.isViewModeTravelExpence(context)) {
        requiredFields.push('CurrencyLstPkr');
        requiredFields.push('AmountProperty');
    }

    if (S4ServiceLibrary.getServiceContractRequiredFromAppParam(context)) {
        requiredFields.push('ServiceContractLstPkr');
    }

    if (S4ServiceLibrary.getServiceContractItemRequiredFromAppParam(context)) {
        requiredFields.push('ServiceContractItemLstPkr');
    }

    return requiredFields;
}

