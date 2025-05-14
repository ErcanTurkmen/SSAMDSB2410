import FormatLibrary from '../../Common/Library/FormatLibrary';

export default function ServiceOrderCaption(context) {
    return FormatLibrary.formatDetailHeaderDisplayValue(context, context.binding.ObjectID, context.localizeText('serviceorder'));
}
