export default function TagRequired(context) {
    return context.binding.TagRequired==='X'? context.localizeText('yes'):context.localizeText('no');
}
