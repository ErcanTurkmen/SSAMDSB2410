import FDCEntitySet from '../../../Measurements/Points/MeasuringPointFDCEntitySet';
import enableMeasurementCreate from '../../../UserAuthorizations/Measurements/EnableMeasurementCreate';
import Logger from '../../../Log/Logger';

export default function PRTMeasuringPointTakeReadingsNavBtnVisible(context) {
    // Return a promise
    return enableMeasurementCreate(context).then((enabled) => {
        if (enabled) {
            let pageProxy = context.getPageProxy();
            // Determine the query options
            return context.count('/SAPAssetManager/Services/AssetManager.service', FDCEntitySet(pageProxy), "$filter=(PRTCategory eq 'P')").then(function(counts) {
                // If there are no measuring points, hide take readings option on pop-over
                return counts > 0;
            });
        } else {
            return false;
        }
    }).catch(function(error) {
        Logger.error(`EnableMeasurementCreate: ${error}`);
        return false; // Return false in case of any error
    });
}
