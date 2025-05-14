import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function InspectionCharacteristicsOnReturning(context) {
    let attachmentData = CommonLibrary.getStateVariable(context, 'InspectionCharacteristicsAttachments');
    let attachmentCtrl = context.getControl('FormCellContainer').getControl('Attachment');

    if (attachmentCtrl && attachmentData) {
        CommonLibrary.setStateVariable(context, 'InspectionCharacteristicsAttachments', undefined);
        attachmentCtrl.setValue(attachmentData, true);
    }
}
