import libVal from '../../Common/Library/ValidationLibrary';

/**
* This function will configure the query options for the material batch TO entity sets.
* 
* @param {IClientAPI} context
*/
export default function BatchToListPickerQueryOptions(context) {
    let qb = context.dataQueryBuilder();
    let toPlant = '-1';
    let material = '-1';

    // if context.binding undefined or context.binding.MovePlant are undefined, then don't use query filter
    // use dummy data for plant and material so that all batches are not returned
    if (!(libVal.evalIsEmpty(context.binding) || libVal.evalIsEmpty(context.binding.MovePlant))) {
        // Material number field name is either "Material" or "MateriaNum" depending upon document type
        if (!libVal.evalIsEmpty(context.binding.Material)) {
            material = context.binding.Material;
        } else if (!libVal.evalIsEmpty(context.binding.MaterialNum)) {
            material = context.binding.MaterialNum;
        }
        toPlant = context.binding.MovePlant;
    } 
    qb.filter(`MaterialNum eq '${material}' and Plant eq '${toPlant}'`);
    return qb;
}
