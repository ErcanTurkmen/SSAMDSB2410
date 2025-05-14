import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function ApprovalSubhead(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMPermitCategories', ['PermitCatText'], `$filter=PermitCategory eq '${context.binding.PermitCategory}'`).then((data) => {
        if (ValidationLibrary.evalIsEmpty(data.getItem(0))) {
            return '-';
        }
        return data.getItem(0).PermitCatText;
    });
}
