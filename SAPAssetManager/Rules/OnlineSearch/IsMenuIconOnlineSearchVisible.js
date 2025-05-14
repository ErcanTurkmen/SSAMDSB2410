import IsOnlineSearchEnabled from './IsOnlineSearchEnabled';
import IsAndroid from '../Common/IsAndroid';

export default function IsMenuIconOnlineSearchVisible(context) {
    if (!IsAndroid(context)) {
        return IsOnlineSearchEnabled(context);
    }
    return false;
}
