export default function TechObjectFilterItemFootnote(context) {
    return context.localizeText(context.binding.ItemCategory === 'E' ? 'equipment' : 'functional_location');
}
