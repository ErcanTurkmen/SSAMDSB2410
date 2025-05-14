import CommonLibrary from '../../Common/Library/CommonLibrary';
import NoteTypeControlLibrary from '../../Notes/Create/NoteTypeControlLibrary';

export default function CommitS4BusinessPartnerNote(context) {
    if (NoteTypeControlLibrary.noteSectionHasValue(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringS4BusinessPartnerCreate.action').then(() => {
            CommonLibrary.setOnCreateUpdateFlag(context);
        });
    }
    CommonLibrary.setOnCreateUpdateFlag(context);
    return Promise.resolve();
}
