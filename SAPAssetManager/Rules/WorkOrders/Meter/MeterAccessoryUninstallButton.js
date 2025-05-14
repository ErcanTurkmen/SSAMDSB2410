import MeterSectionLibrary from '../../Meter/Common/MeterSectionLibrary';

export default function MeterAccessoryUninstallButton(clientAPI) {
    const label = MeterSectionLibrary.getUninstallAccessoryTargetValues(clientAPI, clientAPI.binding, 'Label');
    // if no label available - still returning 'Uninstall' value, which wouldn't be clickable
    return label || MeterSectionLibrary.uninstallAccValues(clientAPI, 'Label');
}
