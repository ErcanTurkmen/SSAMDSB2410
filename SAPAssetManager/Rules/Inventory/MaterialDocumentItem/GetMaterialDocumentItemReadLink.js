import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function GetMaterialDocumentItemReadLink(context) {
    let isMultipleTechnician = EnableMultipleTechnician(context);
    let binding = isMultipleTechnician ? context.getClientData() : context.binding;
    if (!binding || (Object.keys(binding).length === 1 && binding.actionResults)) {
        binding = context.getActionBinding();
    }
    if (binding.TempLine_MatDocItemReadLink) {
        return binding.TempLine_MatDocItemReadLink;
    } else if (isMultipleTechnician) {
        //For MST and FSM Persona, we are not using change set so the readlink for the item will be pending_1
        return 'pending_1';
    } else {
        //Get the material document item key for updating during create related entity action
        return "MaterialDocItems(MatDocItem='" + binding.TempItem_Key + "',MaterialDocNumber='" + binding.TempHeader_Key + "',MaterialDocYear='" + binding.TempHeader_MaterialDocYear + "')";
    }
}
