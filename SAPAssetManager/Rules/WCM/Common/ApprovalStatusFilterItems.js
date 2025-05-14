
export default function ApprovalStatusFilterItems(context) {
    return {
        name: 'TrafficLight', 
        values: [
            {
                ReturnValue: context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/WaitForApproval.global').getValue(), 
                DisplayValue: context.localizeText('waiting_for_approval_status'),
            },
            {
                ReturnValue: context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/PartiallyApproved.global').getValue(), 
                DisplayValue: context.localizeText('partially_approved_status'),
            },
            {
                ReturnValue: context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/TrafficLights/Approved.global').getValue(), 
                DisplayValue: context.localizeText('approved_status'),
            },
        ],
    };
}
