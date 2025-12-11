import libForm from '../../../../SAPAssetManager/Rules/Common/Library/FormatLibrary';
import libVal from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';

export default async function NotificationDetailsItemPartCodeDataTable(context) {
    const binding = context.binding;
    let type = binding.Notification.NotificationType;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], `$filter=NotifType eq '${type}' and length(CatalogProfile) gt 0`).then(function (result) {
        let catalog = result.getItem(0)["CatTypeObjectParts"];
        let query = `$filter=Catalog eq '${catalog}' and Code eq '${binding.ObjectPart}' and CodeGroup eq '${binding.ObjectPartCodeGroup}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'PMCatalogCodes', [], query).then((result) => {
            return libVal.evalIsEmpty(result) ? '-' : libForm.getFormattedKeyDescriptionPair(context, binding.ObjectPart, result.getItem(0).CodeDescription);
        });
    });
}
