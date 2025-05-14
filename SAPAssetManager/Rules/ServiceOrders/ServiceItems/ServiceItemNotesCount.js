import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ServiceItemNotesCount(context) {
    return CommonLibrary.getEntitySetCount(context, `${context.getPageProxy().binding['@odata.readLink']}/LongText_Nav`, "$filter=TextString ne ''");
}
