import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import libCom from '../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function PartCreateMaterialUOM(context) {
    ResetValidationOnInput(context); // clear validation error if any when the list is not empty
    if (!context.binding) {
        return '';
    }
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return context.binding.UoM;
    }
    if (EnableMultipleTechnician(context) && libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage') {
        return context.binding.Material.BaseUOM;
    }
    return context.binding.UnitOfEntry;
}
