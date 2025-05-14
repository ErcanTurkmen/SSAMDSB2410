import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function ApprovalTitle(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMObjectApprovals', ['PermitText'], `$filter=Permit eq '${context.binding.Permit}'`).then((data) => {
        if (ValidationLibrary.evalIsEmpty(data.getItem(0))) {
            return '-';
        }
        return data.getItem(0).PermitText;
    });
}
