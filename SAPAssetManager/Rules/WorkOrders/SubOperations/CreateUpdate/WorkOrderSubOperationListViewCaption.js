import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WorkOrderSubOperationListViewCaption(context) {
    let entitySet;
    let queryOption;
    let localizeText;
    let localizeText_x_x;

    if (context.binding && CommonLibrary.isDefined(context.binding['@odata.readLink'])) {
        entitySet = context.binding['@odata.readLink'] + '/SubOperations';
        queryOption = '';
        localizeText = 'suboperations_x';    
        
        return context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption).then(count => {
            let params=[count];
            return context.setCaption(context.localizeText(localizeText, params));
        }); 
    } else {
        if (CommonLibrary.getWorkOrderAssignmentType(context) === '3') {
            entitySet = 'MyWorkOrderSubOperations';
        } else {
            entitySet = context.binding['@odata.readLink'] + '/SubOperations';
        }
        queryOption = CommonLibrary.getQueryOptionFromFilter(context);
        localizeText = 'suboperations_x';
        localizeText_x_x = 'suboperations_x_x'; 

        const params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet, '');
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service',entitySet,queryOption);

        return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
            let totalCount = resultsArray[0];
            let count = resultsArray[1];
            params.push(count);
            params.push(totalCount);
            if (count === totalCount) {
                return context.setCaption(context.localizeText(localizeText, [totalCount]));
            }
            return context.setCaption(context.localizeText(localizeText_x_x, params));
        }); 
    }
}
