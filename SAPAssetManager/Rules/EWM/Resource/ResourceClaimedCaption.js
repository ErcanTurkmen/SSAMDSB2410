import libCom from '../../Common/Library/CommonLibrary';

/**
* This function gives the count of the physical inventory not counted items...
* @param {IClientAPI} context
*/
export default function ResourceClaimedCaption(context) {
    
    const baseQueryAvailable = "$filter=User ne ''";
    return libCom.getEntitySetCount(context, 'WarehouseResources', baseQueryAvailable,'/SAPAssetManager/Services/OnlineAssetManager.service').then(count => {
        return context.localizeText('resource_claimed_x',[count]); 
    });   
}
