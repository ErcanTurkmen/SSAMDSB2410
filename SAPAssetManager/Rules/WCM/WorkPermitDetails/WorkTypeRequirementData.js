import common from '../../Common/Library/CommonLibrary';

export default function WorkTypeRequirementData(context) { // returns 4 objects in an array with title, tags(selected), and deselected elements for the 4 groups of work types and needs for the binding WCMApplication
    return common.getEntityProperty(context, `${context.binding['@odata.readLink']}`, 'WCMRequirements', 'WCMRequirements').then(wcmRequirements => {
        return Promise.all([
            '/SAPAssetManager/Globals/WCM/Requirements/Work1Id.global',
            '/SAPAssetManager/Globals/WCM/Requirements/Work2Id.global',
            '/SAPAssetManager/Globals/WCM/Requirements/Requirement1Id.global',
            '/SAPAssetManager/Globals/WCM/Requirements/Requirement2Id.global']
            .map(i => context.getGlobalDefinition(i).getValue())
            .map(groupId => context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMWorkReqTexts', [], `$filter=GroupId eq '${groupId}'&$select=GroupTitle,PropertyName,PropertyLabel`)))
                .then(resolveResult => resolveResult
                    .map(reqTexts => ConvertWorkReqTextToReturnItem(wcmRequirements, reqTexts)));
    });
}

function ConvertWorkReqTextToReturnItem(wcmRequirements, reqTexts) {  // convert a single WCMRequirement into a presentable object
    const requirementTexts = new Map(reqTexts.map(i => [i.PropertyName, i]));
    const selectableProperties = GetSelectableTypesReqs(wcmRequirements, requirementTexts);
    return {
        Title: reqTexts.getItem(0).GroupTitle,
        Tags: selectableProperties.filter(i => i.isSelected).map(i => ConvertToTag(i)),  // convert the elements into objects that can be displayed as tags
        Deselected: selectableProperties.filter(i => !i.isSelected).map(i => ConvertToTag(i)),
    };
}

function GetSelectableTypesReqs(wcmRequirements, requirementTexts) {  // set isSelected according to the binding WCMApplication's properties
    return Object.keys(wcmRequirements)
        .filter(i => requirementTexts.has(i))  // intersect the properties of the sap_mobile.WCMRequirement with the set of WCMWorkReqTexts
        .map(i => ({
            PropertyLabel: requirementTexts.get(i).PropertyLabel,
            isSelected: wcmRequirements[i] !== '',
        }));
}

function ConvertToTag(item) {
    return {Text: item.PropertyLabel};
}
