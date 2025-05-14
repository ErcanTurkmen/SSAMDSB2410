import CommonLibrary from '../../Common/Library/CommonLibrary';

export default async function AddAttachmentsNavEDT(context) {
    if (context._context && context._context.element) {
        let sectionHeaderExtension = context._context.element;
        CommonLibrary.setStateVariable(context, 'SectionHeaderExtension', sectionHeaderExtension);
    }
    let page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/InspectionCharacteristics/Update/InspectionCharacteristicsAddEditAttachments.page');
    page.Controls[0].Sections = [];
    page.Controls[0].Sections.push({
        'Controls': [
            {
                '_Name': 'Attachment',
                '_Type': 'Control.Type.FormCell.Attachment',
                'AttachmentTitle': context.localizeText('attached_files'),
                'AttachmentAddTitle': context.localizeText('add'),
                'AttachmentCancelTitle': context.localizeText('cancel'),
                'AttachmentActionType': ['AddPhoto', 'TakePhoto', 'SelectFile'],
                'AllowedFileTypes': [],
                'OnValueChange': '/SAPAssetManager/Rules/Documents/DocumentEditorAttachmentOnValueChange.js',
                'OnPress': '/SAPAssetManager/Rules/Documents/DocumentEditorAttachmentOnPress.js',
                'Value': '/SAPAssetManager/Rules/InspectionCharacteristics/InspectionCharacteristicsAttachmentsEDT.js',
            },  
        ],
    });
    let actionProperties = {
        'PageMetadata': page,
        'PageToOpen': '/SAPAssetManager/Pages/InspectionCharacteristics/Update/InspectionCharacteristicsAddEditAttachments.page',
        'ModalPageFullscreen': true,
    };
    
    return context.getPageProxy().executeAction({
        'Name': '/SAPAssetManager/Actions/InspectionCharacteristics/Update/AddAttachmentsNav.action',
        'Properties': actionProperties,
        'Type': 'Action.Type.Navigation',
    });
}
