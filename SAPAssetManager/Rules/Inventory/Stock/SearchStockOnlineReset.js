/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SearchStockOnlineReset(context) {
    ['PlantListPicker', 'StorageLocationListPicker', 'MatrialId', 'MatrialDescription', 'ManufacturerPartNum', 'StorageBin']
    .map(controlName => context.getPageProxy().getControl('FormCellContainer0').getControl(controlName))
    .forEach(control => control.setValue(''));
}
