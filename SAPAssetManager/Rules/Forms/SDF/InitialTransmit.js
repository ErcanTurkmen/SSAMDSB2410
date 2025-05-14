import updateOnlineXSUAATokenEntity from './updateOnlineXSUAATokenEntity';
import Logger from '../../Log/Logger';
import SDFIsFeatureEnabled from './SDFIsFeatureEnabled';

export default function InitialTransmit(context) {

    if (SDFIsFeatureEnabled(context)) {
        return updateOnlineXSUAATokenEntity(context, '');
    } else {
        Logger.error('UserFeatures','No user features enabled on the backend');
    }
}
