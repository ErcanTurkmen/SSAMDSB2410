
export default function WCMRequirementFilterQueryOptions(context) {
    return DemuxByWCMRequirementFilterName(context, queryOptionsString);
}

export function DemuxByWCMRequirementFilterName(context, callable) {
    switch (context.getName()) {
        case 'WorkType1Filter':
            return callable(context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Work1Id.global').getValue());
        case 'WorkType2Filter':
            return callable(context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Work2Id.global').getValue());
        case 'Requirements1Filter':
            return callable(context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Requirement1Id.global').getValue());
        case 'Requirements2Filter':
            return callable(context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/Requirements/Requirement2Id.global').getValue());
        default:
            return '';
    }
}

function queryOptionsString(groupIdExp) {
    return `$filter=PropertyVisible ne '' and GroupId eq '${groupIdExp}'&$select=PropertyName,PropertyLabel&$orderby=PropertyLabel`;
}
