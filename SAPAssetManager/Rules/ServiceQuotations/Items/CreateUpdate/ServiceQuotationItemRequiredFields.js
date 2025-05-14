import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function ServiceQuotationItemRequiredFields(context) {
    let requiredFields = [
        'ProductIdLstPkr',
        'ItemCategoryLstPkr',
        'DescriptionNote',
    ];

    if (!S4ServiceLibrary.isOnSQChangeset(context)) {
        requiredFields.push('ServiceQuotationLstPkr');
    }

    if (S4ServiceLibrary.getServiceContractRequiredFromAppParam(context)) {
        requiredFields.push('ServiceContractLstPkr');
    }

    if (S4ServiceLibrary.getServiceContractItemRequiredFromAppParam(context)) {
        requiredFields.push('ServiceContractItemLstPkr');
    }

    return requiredFields;
}
