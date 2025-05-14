
export default function BusinessPartnerType(context) {
    let binding = context.binding;
    let type = '';

    if (binding && binding.PartnerFunction_Nav) {
        type = binding.PartnerFunction_Nav.Description;
    }

    if (binding && binding.S4PartnerFunc_Nav) {
        type = binding.S4PartnerFunc_Nav.Description;
    }

    return type || '-';
}
