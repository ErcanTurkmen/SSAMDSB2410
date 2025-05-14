
export default function MainRefObjectFlagValue(context) {
    return context.binding.MainObject === 'X' ? context.localizeText('main_object') : '';
}
