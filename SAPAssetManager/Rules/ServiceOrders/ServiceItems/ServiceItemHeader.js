import libForm from '../../Common/Library/FormatLibrary';

export default function ServiceItemHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.ItemNo, 
        context.localizeText('serviceorder')  + ' ' + context.localizeText('item'));
}
