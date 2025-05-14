import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function AcceptMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('accept');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
