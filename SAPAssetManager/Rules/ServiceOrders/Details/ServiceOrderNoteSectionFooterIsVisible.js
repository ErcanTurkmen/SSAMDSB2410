import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceOrderNoteSectionFooterIsVisible(/** @type {ISelectableSectionProxy} */ context) {
    return CommonLibrary.getEntitySetCount(context, `${context.getPageProxy().binding['@odata.readLink']}/LongText_Nav`, "$filter=TextString ne ''")
        .then(count => 2 < count);
}
