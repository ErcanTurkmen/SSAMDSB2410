import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function CreateUpdateServiceQuotationItemCaption(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return context.localizeText('add_service_quotation_item');
    }
    return context.localizeText('edit_service_quotation_item');
}
