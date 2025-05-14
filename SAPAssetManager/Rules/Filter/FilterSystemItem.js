import isAndroid from '../Common/IsAndroid';
import IsWindows from '../Common/IsWindows';

export default function FilterSystemItem(context) {
    if (isAndroid(context)) {
        return '';
    } else if (IsWindows(context)) {
        return 'Organize';
    } else {
        return 'Apply';
    }
}
