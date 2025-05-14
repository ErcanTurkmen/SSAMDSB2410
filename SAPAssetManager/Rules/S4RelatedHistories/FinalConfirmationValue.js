
export default function FinalConfirmationValue(context) {
    return context.binding.FinalConfirmation === 'X' ? '$(L,yes)' : '$(L,no)';
}
