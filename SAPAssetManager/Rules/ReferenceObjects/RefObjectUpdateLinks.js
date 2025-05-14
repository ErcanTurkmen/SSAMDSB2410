import CommonLibrary from '../Common/Library/CommonLibrary';
import RefObjectLinks, { QuotationRefObjectLinks } from './RefObjectLinks';

export default function RefObjectUpdateLinks(context) {
    if (CommonLibrary.getPageName(context) === 'ServiceQuotationCreateUpdatePage') {
        return QuotationRefObjectLinks(context).update;
    }
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.update;
}
