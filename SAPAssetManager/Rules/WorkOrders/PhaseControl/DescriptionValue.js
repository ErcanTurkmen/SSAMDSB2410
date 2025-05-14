export default function DescriptionValue(context) {
    let binding = context.binding;
    return binding.PhaseControlKey_Nav ? binding.PhaseControlKey_Nav.Description : '-';
}
