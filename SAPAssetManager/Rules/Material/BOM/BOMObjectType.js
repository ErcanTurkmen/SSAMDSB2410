
export default function BOMObjectType(context) {
    
    if (context.binding && context.binding.ObjectType && context.binding.ObjectType === 'C') {
        return context.localizeText('const_type');
    } else {
        return '';
    }
}
