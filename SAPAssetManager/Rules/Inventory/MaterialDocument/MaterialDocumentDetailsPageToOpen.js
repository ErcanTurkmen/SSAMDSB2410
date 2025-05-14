import libCom from '../../Common/Library/CommonLibrary';

export default function MaterialDocumentDetailsPageToOpen(context) {
    const binding = libCom.getStateVariable(context, 'MaterialDocumentBulkUpdate'); //Need to set binding before the page opens
    if (binding) {
        context._context.binding = binding;
        libCom.removeStateVariable(context, 'MaterialDocumentBulkUpdate');
    }
    return '/SAPAssetManager/Pages/Inventory/MaterialDocument/MaterialDocumentDetailsIM.page';
}
