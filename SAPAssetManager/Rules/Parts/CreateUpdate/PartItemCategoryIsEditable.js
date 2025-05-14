import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function PartItemCategoryIsEditable(context) {
    if (EnableFieldServiceTechnician(context)) {
        return true;
    }
    return context.binding['@odata.type'] !== context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue();
}
