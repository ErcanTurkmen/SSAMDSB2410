import libCom from '../../Common/Library/CommonLibrary';

/**
* This function gives the count of the physical inventory not counted items...
* @param {IClientAPI} context
*/
export default function ResourceAvailableCaption(context) {
    
    const baseQueryAvailable = "$filter=User eq ''";
    return libCom.getEntitySetCount(context, 'WarehouseResources', baseQueryAvailable,'/SAPAssetManager/Services/OnlineAssetManager.service').then(count => {
        return context.localizeText('resource_available_x',[count]); 
    });   
}
