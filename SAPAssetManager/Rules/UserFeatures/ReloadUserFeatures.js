import Logger from '../Log/Logger';
import ReadingOfflineUserFeatures from './ReadingOfflineUserFeatures';
import UserFeaturesLibrary from './UserFeaturesLibrary';

// Reload user feature if the online request failed 
export default function ReloadUserFeatures(context) {
    if (UserFeaturesLibrary.isUserFeaturesReceived(context)) {
        return Promise.resolve();
    } else {
        Logger.info('ReloadUserFeatures', true);
        return ReadingOfflineUserFeatures(context);
    }
}
