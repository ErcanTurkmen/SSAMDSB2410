import libPart from '../../../../../SAPAssetManager/Rules/Parts/PartLibrary';

export default function ZPartAdhocIssueMovementLineItemUOM(pageClientAPI) {
    //return pageClientAPI.binding.UnitOfEntry;
     
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libPart.zPartAdhocMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'EntryUOM');
}
