import CommonLibrary from '../../Common/Library/CommonLibrary';
import DocumentLibrary from '../../Documents/DocumentLibrary';

export default function OnCreateServiceQuotationDocuments(context) {
    const attachmentDescription= CommonLibrary.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:AttachmentDescription/#Value');
    const attachments = CommonLibrary.getTargetPathValue(context, '#Page:ServiceQuotationCreateUpdatePage/#Control:Attachment/#Value');

    CommonLibrary.setStateVariable(context, 'DocDescription', attachmentDescription);
    CommonLibrary.setStateVariable(context, 'Doc', attachments);
    CommonLibrary.setStateVariable(context, 'Class', 'ServiceOrder');
    CommonLibrary.setStateVariable(context, 'ObjectKey', 'ObjectID');
    CommonLibrary.setStateVariable(context, 'entitySet', 'S4ServiceQuotationDocuments');
    CommonLibrary.setStateVariable(context, 'parentEntitySet', 'S4ServiceQuotations');
    CommonLibrary.setStateVariable(context, 'parentProperty', 'S4ServiceQuotation_Nav');
    CommonLibrary.setStateVariable(context, 'attachmentCount', DocumentLibrary.validationAttachmentCount(context, 'ServiceQuotationCreateUpdatePage'));
    return Promise.resolve();
}
