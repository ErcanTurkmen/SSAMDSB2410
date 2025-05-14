export default function IsQABIssueApprovalsVisible(context) {
    return context.binding && context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue();
}
