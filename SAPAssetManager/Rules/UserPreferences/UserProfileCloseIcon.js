import isAndroid from '../Common/IsAndroid';
import isWindows from '../Common/IsWindows';

export default function UserProfileCloseIcon(context) {
    if (isAndroid(context) || isWindows(context)) {
        return 'Cancel';
    } 
    return '';
}
