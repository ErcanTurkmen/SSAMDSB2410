import libPart from '../../../../../SAPAssetManager/Rules/Parts/PartLibrary';
	
export default function ZPartAdhocIssueLineItemQuantity(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let partIssue = libPart.zPartAdhocMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'Quantity').toString();
    if (partIssue.includes(',')) {
        partIssue = partIssue.replace(',', '.');
    }
    return partIssue;
}
