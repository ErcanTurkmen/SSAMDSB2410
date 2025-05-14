import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function ReAssignMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('reassign');

    return MobileStatusUpdateWrapper(context, transitionText);
}
