import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function AddAttachmentsNav(context) {
    let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment');
    let attachments = attachmentCtrl.getValue();
    CommonLibrary.setStateVariable(context, 'InspectionCharacteristicsAttachments', attachments);
  
    return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/AddAttachmentsNav.action');
}
