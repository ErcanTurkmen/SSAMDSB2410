export default function SuperiorFloc(context) {
    let formCellContainer = context.getControl('FormCellContainer');
    const value = formCellContainer.getControl('SuperiorFuncLocHierarchyExtensionControl').getValue();

   return value ? value : '';
}
