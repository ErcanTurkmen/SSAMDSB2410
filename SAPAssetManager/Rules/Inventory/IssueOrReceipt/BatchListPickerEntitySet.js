import common from '../../Common/Library/CommonLibrary';

/**
* This function will determine the entityset to be used for the Batch ListPicker
* Goods Receipt will use MaterialBatches which requires Plant and Material
* Goods Issue will use MaterialBatchStockSet which requires Plant, StorageLocation and Material
* @param {IClientAPI} context
*/
export default function BatchListPickerEntitySet(context) {

    let movementType = common.getStateVariable(context, 'IMMovementType');
    if (movementType === 'I') {  // Goods Issue
        return 'MaterialBatchStockSet';
    } else {  // Goods Receipt or other
        return 'MaterialBatches'; 
    }
}
