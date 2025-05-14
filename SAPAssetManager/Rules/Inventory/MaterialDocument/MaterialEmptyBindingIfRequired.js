import libCom from '../../Common/Library/CommonLibrary';

export default function MaterialEmptyBindingIfRequired(context) {
    let created = libCom.getStateVariable(context, 'IsAlreadyCreatedDoc');
    if (created) {
        context.getPageProxy().setActionBinding({});
    }
    return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentModalListNav.action');
}
