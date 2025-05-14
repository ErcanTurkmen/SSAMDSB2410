export default function StatusValue(context) {
    return context.localizeText(context.binding.IsActive === 'X' ? 'Active' : 'Inactive');
}
