
export default function SetServiceOrderServiceProfileValue(context) {
    if (context.binding && context.binding.S4ServiceOrder_Nav && context.binding.S4ServiceOrder_Nav.ServiceProfile) {
        return context.binding.S4ServiceOrder_Nav.ServiceProfile;
    } else if (context.binding && context.binding.ServiceProfile && context.binding.ServiceProfile_Nav) {
        return `${context.binding.ServiceProfile} - ${context.binding.ServiceProfile_Nav.Description}` ;
    }

    return '';
}
