/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import ComLib from '../../Common/Library/CommonLibrary';
export default function ResourceListCaption(clientAPI) {
    const entitySet = 'WarehouseResources';
    let queryOptions = ComLib.getQueryOptionFromFilter(clientAPI);
    if (!queryOptions && !clientAPI.getPageProxy().getControls()?.length > 0) {
        queryOptions = "$filter=(User eq '')";
    }    
        let searchString = clientAPI.searchString.toUpperCase();
        if (searchString) { 
           searchString = `Resource eq '*${searchString}*'`;
        }
    queryOptions = decodeURIComponent(queryOptions);    
    queryOptions = ComLib.attachFilterToQueryOptionsString(queryOptions,searchString);

    return Promise.all([
        ComLib.getEntitySetCount(clientAPI, entitySet, '','/SAPAssetManager/Services/OnlineAssetManager.service'),
        ComLib.getEntitySetCount(clientAPI, entitySet, queryOptions,'/SAPAssetManager/Services/OnlineAssetManager.service'),
    ]).then(([totalCount, count]) => totalCount && totalCount !== count ? clientAPI.localizeText('Resources_x_x', [count, totalCount]) : clientAPI.localizeText('Resources_x', [count]));

}
