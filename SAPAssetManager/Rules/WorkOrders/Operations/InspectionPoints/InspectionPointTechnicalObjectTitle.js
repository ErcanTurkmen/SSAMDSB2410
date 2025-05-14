export default function InspectionPointTechnicalObjectTitle(context) {
    let binding = context.binding;
    if (Object.prototype.hasOwnProperty.call(binding,'Equip_Nav') && binding.Equip_Nav != null) {
        return context.localizeText('equipment');
    } else if (Object.prototype.hasOwnProperty.call(binding,'FuncLoc_Nav') && binding.FuncLoc_Nav != null) {
        return context.localizeText('functional_location');
    }
    return '';
}
