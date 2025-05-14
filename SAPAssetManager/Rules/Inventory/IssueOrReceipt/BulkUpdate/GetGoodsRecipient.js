import { GetFirstOpenItemForDocument } from './BulkUpdateLibrary';

export default function GetGoodsRecipient(context) {
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    return GetFirstOpenItemForDocument(context, type, context.binding).then(item => {
        if (item) {
            return item.GoodsRecipient;
        }
        return '';
    });
}
