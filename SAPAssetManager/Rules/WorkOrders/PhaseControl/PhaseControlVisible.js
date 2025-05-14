import Logger from '../../Log/Logger';
import IsPhaseControlEnabled from '../../Common/IsPhaseControlEnabled';

export default function PhaseControlVisible(context) {
    let binding = context.getPageProxy().binding || context.binding;
    if (IsPhaseControlEnabled(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/PhaseControl_Nav', [], '$expand=PhaseControlKey_Nav').then(results => {
            if (results.length > 0) {
                for (let index = 0; index < results.length; index++) {
                    if (results.getItem(index).IsActive === 'X') {
                        return true;
                    }
                }
                return false;
            }
            return false;
        }).catch(error => {
            Logger.error('PhaseControl_Nav', error);
            return false;
        });
    } else {
        return false;
    }
}
