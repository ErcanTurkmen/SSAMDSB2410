import FDCQueryOptions from './MeasuringPointFDCQueryOptions';
import FDCEntitySet from './MeasuringPointFDCEntitySet';
import libCommon from '../../Common/Library/CommonLibrary';
import enableMeasurementCreate from '../../UserAuthorizations/Measurements/EnableMeasurementCreate';

export default function MeasuringPointFDCIsVisible(context, actionBinding) {
    const binding = actionBinding || context.getPageProxy().binding;
    // hide for local WO/Notification
    if (binding && binding['@sap.isLocal']) {
        return Promise.resolve(false);
    }

    if (enableMeasurementCreate(context, binding)) {
        //Determie the query options
        return FDCQueryOptions(context, binding).then(function(result) {
            ///If query options are defined do count else hide take readings option on pop-over
            if (libCommon.isDefined(result)) {
                return context.count('/SAPAssetManager/Services/AssetManager.service', FDCEntitySet(context, binding), result).then(function(counts) {
                    ///If there are no measuring point hide take readings option on pop-over
                    return counts > 0;
                });
            } else {
                return false;
            }
        });
    }
    return Promise.resolve(false);

}
