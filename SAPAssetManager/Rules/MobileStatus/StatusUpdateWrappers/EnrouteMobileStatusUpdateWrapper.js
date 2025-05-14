import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function EnrouteMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('enroute');
    
    return MobileStatusUpdateWrapper(context, transitionText);
}
