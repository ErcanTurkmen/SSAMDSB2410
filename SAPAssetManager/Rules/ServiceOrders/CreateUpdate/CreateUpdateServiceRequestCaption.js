import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function CreateUpdateServiceRequestCaption(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return context.localizeText('add_service_request');
    }

    return context.localizeText('edit_service_request');
}
