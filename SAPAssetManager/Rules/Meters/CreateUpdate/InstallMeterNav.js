
import EDTSoftInputModeConfig from '../../Extensions/EDT/EDTSoftInputModeConfig';

export default function InstallMeterNav(context) {
    EDTSoftInputModeConfig(context);
    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/InstallMeterNav.action');
}
