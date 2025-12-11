import libPart from '../../../../../SAPAssetManager/Rules/Parts/PartLibrary';

export default function ZPartAdhocIssueLineItemMovementType(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.zPartAdhocMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'MovementType', 'MovementType');
}
