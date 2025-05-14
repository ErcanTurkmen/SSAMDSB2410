import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function AssignMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('assign');

    return MobileStatusUpdateWrapper(context, transitionText);
}
