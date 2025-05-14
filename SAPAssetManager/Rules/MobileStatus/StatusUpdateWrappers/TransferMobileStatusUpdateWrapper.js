import MobileStatusUpdateWrapper from './MobileStatusUpdateWrapper';

export default function TransferMobileStatusUpdateWrapper(context) {
    const transitionText = context.localizeText('transfer');

    return MobileStatusUpdateWrapper(context, transitionText);
}
