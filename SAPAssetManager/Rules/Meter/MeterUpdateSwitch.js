import libMeter from './Common/MeterLibrary';
import MeterUpdateNav from './MeterUpdateNav';

export default function MeterUpdateSwitch(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        libMeter.setMeterTransactionType(context);
        return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
    }

    return MeterUpdateNav(context);
}
