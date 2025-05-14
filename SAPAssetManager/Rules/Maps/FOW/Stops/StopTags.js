import libStatus from '../../../FOW/Routes/MobileStatusLibrary';

export default function StopTags(context) {
    let tags = [undefined];
    tags[0] = context.localizeText(libStatus.mobileStatus(context, context.binding));
    return tags.join();
}
