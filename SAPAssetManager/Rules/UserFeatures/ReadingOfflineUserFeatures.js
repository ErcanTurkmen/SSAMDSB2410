import Logger from '../Log/Logger';
import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function ReadingOfflineUserFeatures(context) {
    ///Read features enable for the user from UserFeatures entity set
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserFeatures', [], '').then(function(features) {
            if (features.length > 0) {
                ///delete the previous flags
                UserFeaturesLibrary.disableAllFeatureFlags(context);
                //enable the new flags coming from the backend
                UserFeaturesLibrary.setUserFeatures(context,features);         
            } else {
                UserFeaturesLibrary.disableAllFeatureFlags(context);
                Logger.error('UserFeatures ','No Features were enable on the backend');
            }
        }).catch(() => {
            Logger.error('UserFeatures','Reading UserFeatures from online service failed');
        });
}
