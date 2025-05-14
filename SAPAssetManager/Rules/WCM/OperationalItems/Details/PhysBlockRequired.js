export default function PhysBlockRequired(context) {
    return context.binding.PhysBlocking==='X'? context.localizeText('yes'):context.localizeText('no');
}
