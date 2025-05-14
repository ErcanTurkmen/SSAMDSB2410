import ModifyKeyValueSection from '../../../LCNC/ModifyKeyValueSection';

export default async function ServiceQuotationItemDetailsPageMetadata(context) {
    const page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceQuotations/ServiceQuotationItemDetails.page');
    return await ModifyKeyValueSection(context, page, 'ServiceQuotationItemDetailsSection');
}
