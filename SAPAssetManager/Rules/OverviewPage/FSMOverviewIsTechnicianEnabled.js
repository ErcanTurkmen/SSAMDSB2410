import isWindows from '../Common/IsWindows';
import enabledServiceTechnician from '../SideDrawer/EnableFieldServiceTechnician';
export default function FSMOverviewIsTechnicianEnabled(context) {
    return (enabledServiceTechnician(context) && isWindows(context));
}
