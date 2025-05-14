import TrafficLightStatusIcon from '../Common/TrafficLightStatusIcon';

/** @param {{getPageProxy(): IClientAPI & {binding: WCMDocumentHeader | WCMApplication}}} context  */
export default function ApprovalsSectionIcons(context) {
    return [TrafficLightStatusIcon(context, context.getPageProxy().binding.TrafficLight)];
}
