import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function DisapproveMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('disapprove');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
