export default function ConnectedStatus(context) {
    if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        return context.getPageProxy().binding.Device_Nav.DeviceBlocked? context.localizeText('disconnect') : context.localizeText('connected');
    } else {
        return '';
    }
}
