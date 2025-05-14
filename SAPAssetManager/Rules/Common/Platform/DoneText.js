import isAndroid from '../IsAndroid';

export default function DoneText(context) {
    if (isAndroid(context)) {
        return context.localizeText('save');
    } else {
        return context.localizeText('done');
    }
}
