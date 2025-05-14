export default function FuncLoc(clientAPI) {
    let formCellContainer = clientAPI.getControl('FormCellContainer');
    const value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();

    return value ? value : '';
}
