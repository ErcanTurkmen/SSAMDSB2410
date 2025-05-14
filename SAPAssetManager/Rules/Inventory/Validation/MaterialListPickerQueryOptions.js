import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Collect query options for Materials list picker
* @param {IClientAPI} context
* Using the MaterialPlants instead of MaterialSLocs to handle Non-Stock and PIPELINE materials
* There is no need differentiate between GR and GI anymore
*/
export default function MaterialListPickerQueryOptions(context) {
    let queryPlant = libCom.getStateVariable(context, 'MaterialPlantValue');
    let searchString = context.searchString;
    let filtersArray = [];

    let plant = libCom.getStateVariable(context, 'CurrentDocsItemsPlant');
    let qb = context.dataQueryBuilder();

    if (searchString) {
        searchString = context.searchString.toLowerCase();
        filtersArray.push(`substringof('${searchString}', tolower(MaterialNum))`);
        filtersArray.push(`substringof('${searchString}', tolower(Material/Description))`);
        filtersArray.push(`substringof('${searchString}', tolower(Material/ManufacturerPartNum))`);
        qb.filter('(' + filtersArray.join(' or ') + ')');
    }
    if (!libVal.evalIsEmpty(context.binding) && !queryPlant) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            queryPlant = context.binding.Plant;
        }
    }
    const values = updateQueryFilters(queryPlant, plant);
    queryPlant = values.queryPlant;

    qb.expand('Material', 'Material/MaterialBatch_Nav');
    qb.orderBy('MaterialNum', 'Plant');
    qb.filter(`Plant eq '${queryPlant}'`);
    return qb;
}

function updateQueryFilters(prevQueryPlant, plant) {
    let queryPlant = prevQueryPlant;

    if (!queryPlant) {
        if (plant) {
            queryPlant = plant;
        } else {
            queryPlant = libCom.getUserDefaultPlant();
        }
    }

    return { queryPlant };
}
