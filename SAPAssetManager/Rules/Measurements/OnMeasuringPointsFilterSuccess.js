import libVal from '../Common/Library/ValidationLibrary';
import measuringPointsEntity from './Points/MeasuringPointsListViewEntitySet';
import measuringPointsQueryOption from './Points/MeasuringPointsListViewQueryOption';
import excludeSelectExpandOptions from './ExcludeSelectExpandOptions';

export default function OnMeasuringPointsFilterSuccess(context) {
    let queryOption = libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter;
    let query = measuringPointsQueryOption(context);
    
    return setMeasuringPoitsListCaptionWithCount(context, queryOption, query);
}

export function setMeasuringPoitsListCaptionWithCount(context, queryOption, totalQueryOption) {
    let params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', measuringPointsEntity(context), excludeSelectExpandOptions(totalQueryOption));
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', measuringPointsEntity(context), queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(counts) {
        let totalCount = counts[0];
        let count = counts[1];
        params.push(count);
        params.push(totalCount);
        if (count === totalCount) {
            return context.setCaption(context.localizeText('measuring_points_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('measuring_points_x_x', params));
    });
}
