import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function WorkCompletedMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('work_completed');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
