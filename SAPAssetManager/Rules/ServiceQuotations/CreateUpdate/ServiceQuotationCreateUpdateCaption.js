import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceQuotationCreateUpdateCaption(context) {
    if (libCom.IsOnCreate(context)) {
        return context.localizeText('add_service_quotation');
    }

    return context.localizeText('edit_service_quotation');
}
