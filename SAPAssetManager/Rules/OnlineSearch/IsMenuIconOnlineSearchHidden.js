import IsOnlineSearchDisabled from './IsOnlineSearchDisabled';
import IsAndroid from '../Common/IsAndroid';

export default function IsMenuIconOnlineSearchHidden(context) {
    if (IsAndroid(context)) {
        return true;
    }
    return IsOnlineSearchDisabled(context);
}

