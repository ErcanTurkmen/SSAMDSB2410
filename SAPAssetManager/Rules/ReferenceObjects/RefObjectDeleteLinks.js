import CommonLibrary from '../Common/Library/CommonLibrary';
import RefObjectLinks, { QuotationRefObjectLinks } from './RefObjectLinks';

export default function RefObjectDeleteLinks(context) {
    if (CommonLibrary.getPageName(context) === 'ServiceQuotationCreateUpdatePage') {
        return QuotationRefObjectLinks(context).delete;
    }
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.delete;
}
