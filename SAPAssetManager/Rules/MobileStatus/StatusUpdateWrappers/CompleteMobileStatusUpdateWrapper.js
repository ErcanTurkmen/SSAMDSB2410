import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function CompleteMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('complete');

    return MobileStatusUpdateWrapper(context, transitionText);
}
