import WCMQABDetailsPageIsVisible from '../QAB/WCMQABDetailsPageIsVisible';

export default function WCMActivityTrackerUseTopPadding(context) {
    return !WCMQABDetailsPageIsVisible(context);
}
