import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function ConfirmMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('confirm');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
