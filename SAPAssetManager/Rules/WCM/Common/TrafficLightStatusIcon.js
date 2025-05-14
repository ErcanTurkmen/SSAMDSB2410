
export default function TrafficLightStatusIcon(context, status) {
    switch (status) {
        case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue():
            return '/SAPAssetManager/Images/trafficlight_green.png';
        case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/PartiallyApproved.global').getValue():
            return '/SAPAssetManager/Images/trafficlight_orange.png';
        case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/WaitForApproval.global').getValue():
            return '/SAPAssetManager/Images/trafficlight_red.png';
        default:
            return undefined;
    }
}
