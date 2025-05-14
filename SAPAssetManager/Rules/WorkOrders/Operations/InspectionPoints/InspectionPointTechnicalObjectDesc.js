export default function InspectionPointTechnicalObjectDesc(context) {
    let binding = context.binding;
    let title = '';

    if (Object.prototype.hasOwnProperty.call(binding,'Equip_Nav') && binding.Equip_Nav != null) {
        title = binding.Equip_Nav.EquipDesc + ' - ' + binding.EquipNum;
    } else if (Object.prototype.hasOwnProperty.call(binding,'FuncLoc_Nav') && binding.FuncLoc_Nav != null) {
        title = binding.FuncLoc_Nav.FuncLocDesc + ' - ' + binding.FuncLoc_Nav.FuncLocId;
    }

    if (binding.InspectionNode) {
        title += ` (${binding.InspectionNode})`;
    }
    return title;
}
