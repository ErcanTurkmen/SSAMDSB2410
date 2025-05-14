import CommonLibrary from '../../../Common/Library/CommonLibrary';
import DocumentLibrary from '../../../Documents/DocumentLibrary';
import GetServiceItemObjectType from '../../../ServiceItems/CreateUpdate/Data/GetServiceItemObjectType';

export default async function OnCreateServiceQuotationItemDocuments(context) {
    const attachmentDescription = CommonLibrary.getControlProxy(context, 'AttachmentDescription').getValue() || '';
	const attachments = CommonLibrary.getControlProxy(context, 'Attachment').getValue();
    const itemObjectType = await GetServiceItemObjectType(context);

	CommonLibrary.setStateVariable(context, 'DocDescriptionItem', attachmentDescription);
	CommonLibrary.setStateVariable(context, 'DocItem', attachments);
	CommonLibrary.setStateVariable(context, 'ObjectLinkItem', itemObjectType);
	CommonLibrary.setStateVariable(context, 'ClassItem', 'ServiceOrder');
	CommonLibrary.setStateVariable(context, 'ObjectKeyItem', 'ItemNo');
	CommonLibrary.setStateVariable(context, 'entitySetItem', 'S4ServiceQuotationDocuments');
	CommonLibrary.setStateVariable(context, 'parentPropertyItem', 'S4ServiceQuotItem_QuotDoc');
	CommonLibrary.setStateVariable(context, 'parentEntitySetItem', 'S4ServiceQuotationItems');
	CommonLibrary.setStateVariable(context, 'attachmentCountItem', DocumentLibrary.validationAttachmentCount(context));
	return Promise.resolve();
}
