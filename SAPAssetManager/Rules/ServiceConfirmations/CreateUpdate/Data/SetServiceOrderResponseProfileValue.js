
export default function SetServiceOrderResponseProfileValue(context) {
    if (context.binding && context.binding.S4ServiceOrder_Nav && context.binding.S4ServiceOrder_Nav.ResponseProfile) {
        return context.binding.S4ServiceOrder_Nav.ResponseProfile;
    } else if (context.binding && context.binding.ResponseProfile) {
        return context.binding.ResponseProfile;
    }

    return '';
}
