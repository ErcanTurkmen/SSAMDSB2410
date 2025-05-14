import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function ReviewMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('review');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
