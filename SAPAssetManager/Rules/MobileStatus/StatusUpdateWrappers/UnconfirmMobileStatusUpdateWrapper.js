import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function UnconfirmMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('unconfirm');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
