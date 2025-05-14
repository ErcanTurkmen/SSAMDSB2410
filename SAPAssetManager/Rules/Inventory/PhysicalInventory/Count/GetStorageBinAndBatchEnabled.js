/**
 * Return an array with storage bin/batch enabled/valuation enabled for handling screen fields
 * @param {*} context 
 * @returns 
 */
export default function GetStorageBinAndBatchEnabled(context) {
    let emptyArray = ['', false, false];
    let plant,sloc;
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    try {
        //Get the storage bin/batch/valuated for this plant/material/sloc
        let material = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker').getValue()[0].ReturnValue;
        
        // This logic is used for the PhysicalInventoryItemCreateUpdatePage page and the PhysicalInventoryCreateUpdatePage page
        // Need to check if plantlstpkr exists on page, and if so use the selected value, otherwise use planttitle
        plant = formCellContainer.getControl('PlantLstPkr')?.getValue()[0]?.ReturnValue || formCellContainer.getControl('ItemPlantTitle')?.getValue();
        sloc = formCellContainer.getControl('StorageLocationPicker')?.getValue()[0].ReturnValue || formCellContainer.getControl('ItemStorageLocationTitle')?.getValue();
 
        let query = "$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "' and StorageLocation eq '" + sloc + "'";
        query += '&$expand=MaterialPlant';

        if (material && plant && sloc) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', ['StorageBin','BatchIndicator','MaterialPlant/ValuationCategory'], query).then(function(results) { 
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    let val = false;
                    if (row.MaterialPlant && row.MaterialPlant.ValuationCategory) {
                        val = true;
                    }
                    return [row.StorageBin, (row.BatchIndicator === 'X'), val]; //Storage bin/batch enabled/valuation enabled
                }
                return emptyArray;
            });
        }
        return Promise.resolve(emptyArray); //Nothing to check
    } catch (error) {
        return Promise.resolve(emptyArray);
    }
}
