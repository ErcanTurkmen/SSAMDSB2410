import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function UnAssignMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('unassign');

    return MobileStatusUpdateWrapper(context, transitionText);
}
