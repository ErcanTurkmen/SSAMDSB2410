import ServiceQuotationCategoryLinks from './ServiceQuotationCategoryLinks';

export default function ServiceQuotationDeleteLinks(context) {
    const links = ServiceQuotationCategoryLinks(context);
    return links.delete;
}
