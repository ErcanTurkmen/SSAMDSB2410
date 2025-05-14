import isWindows from '../Common/IsWindows';
import isStockEnabled from '../SideDrawer/SideDrawerStockLookUp';
export default function FSMOverviewIsStockEnabled(context) {
    return (isStockEnabled(context) && isWindows(context));
}
