import ModifyKeyValueSection from '../../LCNC/ModifyKeyValueSection';

export default async function ServiceQuotationDetailsPageMetadata(context) {
    const page = context.getPageDefinition('/SAPAssetManager/Pages/ServiceQuotations/ServiceQuotationDetails.page');
    return await ModifyKeyValueSection(context, page, 'ServiceQuotationDetailsSection');
}
