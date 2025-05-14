import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function RejectMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('reject');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
