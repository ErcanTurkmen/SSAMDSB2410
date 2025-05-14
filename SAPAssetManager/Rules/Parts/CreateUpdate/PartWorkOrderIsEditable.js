import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function PartWorkOrderIsEditable(context) {
    if (EnableMultipleTechnician(context)) {
        return true;
    }
    return context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue();
}
