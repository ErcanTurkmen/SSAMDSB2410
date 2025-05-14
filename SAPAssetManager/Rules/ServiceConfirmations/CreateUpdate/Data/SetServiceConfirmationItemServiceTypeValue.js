
export default function SetServiceConfirmationItemServiceTypeValue(context) {
    if (context.binding && context.binding.ServiceType) {
        return context.binding.ServiceType;
    }

    return '';
}
