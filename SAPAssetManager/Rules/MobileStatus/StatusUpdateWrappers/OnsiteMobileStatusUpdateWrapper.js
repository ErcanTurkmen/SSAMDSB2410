import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function OnsiteMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('onsite');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
