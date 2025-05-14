import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function CreateUpdateServiceConfirmationDoneButtonText(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return context.localizeText('next');
    }

    return context.localizeText('done');
}
