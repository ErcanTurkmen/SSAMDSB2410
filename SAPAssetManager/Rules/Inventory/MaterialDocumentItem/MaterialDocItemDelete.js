import libCom from '../../Common/Library/CommonLibrary';

export default function MaterialDocItemDelete(context) {
    libCom.setStateVariable(context, 'NotClosePage', true);
    return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocumentItem/MaterialDocItemDelete.action');
}
