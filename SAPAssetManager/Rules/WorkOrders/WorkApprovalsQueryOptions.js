export default function WorkApprovalsQueryOptions(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WCMApprovals_Nav').then(function(value) {
            value = value.getItem(0);
            return value.WCMApprovals_Nav;
    }).then(number=>number?`$filter=WCMApproval eq '${number.WCMApproval}'`:`$filter=WCMApproval eq '${number}'`);
}
