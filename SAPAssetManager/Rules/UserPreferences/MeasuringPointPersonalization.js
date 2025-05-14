import isWindows from '../Common/IsWindows';
import EnableMultipleTechnician from '../SideDrawer/EnableMultipleTechnician';
export default function MeasuringPointPersonalization(context) {
    return !isWindows(context) && EnableMultipleTechnician(context);
}
