import libPart from '../../../../../SAPAssetManager/Rules/Parts/PartLibrary';

export default function ZPartAdhocIssueMovementLineItemPlant(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.zPartAdhocMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'Plant');
}
