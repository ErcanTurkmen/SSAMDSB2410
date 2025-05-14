export default function SuperiorEquip(clientAPI) {
    let formCellContainer = clientAPI.getControl('FormCellContainer');
    const value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();

   return value ? value : '';
}
