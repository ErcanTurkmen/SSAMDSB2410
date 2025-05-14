import isWindows from '../Common/IsWindows';
import IsS4Enabled from '../SideDrawer/IsS4SidePanelEnabled';
export default function FSMOverviewIsS4Enabled(context) {
    return (IsS4Enabled(context) && isWindows(context));
}
