import CommonLibrary from '../Common/Library/CommonLibrary';
import RefObjectLinks, { QuotationRefObjectLinks } from './RefObjectLinks';

export default function RefObjectCreateLinks(context) {
    if (CommonLibrary.getPageName(context) === 'ServiceQuotationCreateUpdatePage') {
        return QuotationRefObjectLinks(context).create;
    }
    
    const refObjectLinks = RefObjectLinks(context);
    return refObjectLinks.create;
}
