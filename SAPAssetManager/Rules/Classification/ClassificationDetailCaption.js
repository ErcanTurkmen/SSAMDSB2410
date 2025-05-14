export default function ClassificationDetailCaption(context) {
    const caption = context.localizeText('classification');
    return caption + ' ' + context.binding.ClassId;
}
