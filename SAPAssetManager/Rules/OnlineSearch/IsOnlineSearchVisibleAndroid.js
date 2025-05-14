import IsOnlineSearchEnabled from './IsOnlineSearchEnabled';
import IsAndroid from '../Common/IsAndroid';

export default function IsOnlineSearchVisibleAndroid(context) {
    if (IsAndroid(context)) {
        return IsOnlineSearchEnabled(context);
    }
    return false;
}
