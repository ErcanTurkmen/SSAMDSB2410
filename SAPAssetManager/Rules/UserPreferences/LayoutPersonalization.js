import isWindows from '../Common/IsWindows';
export default function LayoutPersonalization(context) {
    return !isWindows(context);
}
