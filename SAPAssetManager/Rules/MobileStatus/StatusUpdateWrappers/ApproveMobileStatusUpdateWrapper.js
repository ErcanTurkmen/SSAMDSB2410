import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function ApproveMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('approve');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
