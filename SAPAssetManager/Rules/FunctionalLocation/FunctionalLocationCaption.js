import count  from '../FunctionalLocation/FunctionalLocationCount';
import CommonLibrary from '../Common/Library/CommonLibrary';
import FLOCFilterbyType from './FLOCFilterByType';

export default function FunctionalLocationCaption(context) {
    return count(context).then(result => {
        let queryOption = CommonLibrary.getQueryOptionFromFilter(context);
        let extraQuery = FLOCFilterbyType(context);

        if (queryOption === '$filter=') queryOption = '';

        if (queryOption && extraQuery) {
            queryOption += ' and ' + extraQuery; 
        }

        if (!queryOption) queryOption = '$filter=' + extraQuery;

        if (queryOption && queryOption !== '$filter=') {
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations',queryOption).then(function(filteredCount) {
                if (filteredCount === result) {
                    return context.localizeText('functional_location_x', [result]);
                }
                return context.localizeText('functional_location_x_x', [filteredCount, result]);
            });
        } else {
            return context.localizeText('function_location_caption', [result]);
        } 
    });
}
