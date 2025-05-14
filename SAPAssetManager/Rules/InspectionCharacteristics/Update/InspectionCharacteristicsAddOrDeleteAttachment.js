import libCom from '../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsAddOrDeleteAttachment(context) {
    const attachmentFormcell = context.getControl('FormCellContainer').getControl('Attachment');
    libCom.setStateVariable(context, 'InspectionCharacteristicsAttachments', attachmentFormcell.getValue());
    libCom.setStateVariable(context, 'DeletedInspectionCharacteristicsAttachments', attachmentFormcell.getClientData().DeletedAttachments);
    libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
}
