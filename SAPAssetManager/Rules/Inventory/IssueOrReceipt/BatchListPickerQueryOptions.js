import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* This function will configure the query options for the material entity sets.
* Goods Receipt will use MaterialBatches which requires Plant and Material
* Goods Issue will use MaterialBatchStockSet which requires Plant, StorageLocation and Material
* @param {IClientAPI} context
*/
export default function BatchListPickerQueryOptions(context) {

    let queryPlant = libCom.getStateVariable(context, 'MaterialPlantValue');
    let querySLoc = libCom.getStateVariable(context, 'MaterialSLocValue');
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let qb = context.dataQueryBuilder();
  
    if (!libVal.evalIsEmpty(context.binding) && !queryPlant) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'ReservationItem') {
            queryPlant = context.binding.SupplyPlant;
            if (!querySLoc) {
                querySLoc = context.binding.SupplyStorageLocation;
            }
        }
    }
   
    if (!queryPlant) {
        queryPlant = context.binding?.Plant || libCom.getUserDefaultPlant();
    }
    if (!querySLoc) {
        querySLoc = context.binding?.StorageLocation || libCom.getUserDefaultStorageLocation();
    }

    // Material number field name is either "Material" or "MateriaNum" depending upon document type
    let queryMaterial = '';
    if (!libVal.evalIsEmpty(context.binding?.Material)) {
        queryMaterial = context.binding.Material;
    } else if (!libVal.evalIsEmpty(context.binding?.MaterialNum)) {
        queryMaterial = context.binding.MaterialNum;
    }
    let searchString = context.searchString;
    
    if (searchString) {
        searchString = searchString.toLowerCase();
        const filters = `substringof('${searchString}', tolower(Batch))`;
        qb.filter('(' + filters + ')');
    }

    if (movementType === 'I') {  // Goods Issue = use filter for entityset MaterialBatchStockSet
        qb.filter(`MaterialNum eq '${queryMaterial}' and Plant eq '${queryPlant}' and StorageLocation eq '${querySLoc}'`);
        return qb;
    } else { // Goods Receipt = use filter for entitySet MaterialBatches
        qb.filter(`MaterialNum eq '${queryMaterial}' and Plant eq '${queryPlant}'`);
        return qb;
    }

}
