import { DemuxByWCMRequirementFilterName } from './WCMRequirementFilterQueryOptions';

export default function WorkTypeWorkReqName(context) {
    return DemuxByWCMRequirementFilterName(context, (groupId) => getNameByGroupId(groupId, context));
}

function getNameByGroupId(groupId, context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMWorkReqTexts', [], `$filter=GroupId eq '${groupId}'&$select=GroupTitle&$top=1`)
        .then(result => result.getItem(0).GroupTitle);
}
