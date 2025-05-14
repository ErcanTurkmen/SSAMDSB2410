
export default function PhysicalIventoryCreateUpdateRequiredFields(context) {
    const requiredFields = [
        'PlantLstPkr',
        'StorageLocationPicker',
        'StockTypePicker',
        'MatrialListPicker',
        'QuantitySimple',
        'UOMListPicker',
    ];

    const formcellContainer = context.getPageProxy().getControl('FormCellContainer');
    ['VendorListPicker', 'WBSElementSimple']
        .map(name => formcellContainer.getControl(name))
        .filter(control => control?.visible)
        .forEach(control => requiredFields.push(control.getName()));

    return requiredFields;
}
