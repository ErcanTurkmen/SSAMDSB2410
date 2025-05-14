import ApprovalStatusFilterItems from './ApprovalStatusFilterItems';

export default function ApprovalStatusText(context) {
    const binding = context.binding && context.binding['@odata.type'] ? context.binding : context.getPageProxy().binding;
    const trafficLight = ApprovalStatusFilterItems(context).values.find(item => item.ReturnValue.toString() === binding.TrafficLight.toString());
    return trafficLight ? trafficLight.DisplayValue : '-';
}
