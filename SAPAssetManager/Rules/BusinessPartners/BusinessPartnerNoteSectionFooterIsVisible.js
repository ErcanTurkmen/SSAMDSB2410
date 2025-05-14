import CommonLibrary from '../Common/Library/CommonLibrary';

export default function BusinessPartnerNoteSectionFooterIsVisible(/** @type {ISelectableSectionProxy} */ context) {
    return CommonLibrary.getEntitySetCount(context, `${context.getPageProxy().binding['@odata.readLink']}/BusinessPartner_Nav/S4BusinessPartnerLongText_Nav`, "$filter=TextString ne ''")
        .then(count => 2 < count);
}
