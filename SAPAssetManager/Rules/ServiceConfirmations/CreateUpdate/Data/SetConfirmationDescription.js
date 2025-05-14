
export default function SetConfirmationDescription(context) {
    if (context.binding && context.binding.Description) {
        return context.binding.Description;
    }

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/S4ServiceOrder_Nav', [], '').then(result => {
            return result.getItem(0).Description;
        });
    }

    return '';
}
