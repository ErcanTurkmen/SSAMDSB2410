
export default function SetServiceItemStatusValue(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        if (context.binding.MobileStatus_Nav) {
            return context.binding.MobileStatus_Nav.MobileStatus;
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=MobileStatus_Nav').then(result => {
            return result.length ? result.getItem(0).MobileStatus_Nav.MobileStatus : '';
        });
    }

    return context.localizeText('open_status');
}
