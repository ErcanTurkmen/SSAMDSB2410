import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function CreateUpdateServiceOrderCaption(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return context.localizeText('add_service_order');
    }

    return context.localizeText('edit_service_order');
}
