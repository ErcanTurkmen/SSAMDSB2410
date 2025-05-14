
export default function SetFinalConfirmationValue(context) {
    if (context.binding) {
        return context.binding.FinalConfirmation === 'Y';
    }

    return false;
}
