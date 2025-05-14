import RedrawFilterToolbar from '../Filter/RedrawFilterToolbar';

export default function EmergencyWorkOnValueChange(control) {
    let previosPage = control.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
    let clientData = previosPage ? previosPage.getClientData() : null;
    if (clientData) {
        clientData.OrderProcessingContext = control.getValue();
    }
    RedrawFilterToolbar(control);
}
