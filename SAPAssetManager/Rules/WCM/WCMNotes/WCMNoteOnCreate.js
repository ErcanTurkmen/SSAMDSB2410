import libCom from '../../Common/Library/CommonLibrary';
import { NoteLibrary } from '../../Notes/NoteLibrary';
import WCMNotesLibrary from './WCMNotesLibrary';
import NoteCreateOnCommit from '../../Notes/NoteCreateOnCommit';
import ConstantsLibrary from '../../Common/Library/ConstantsLibrary';

export default function WCMNoteOnCreate(context) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(context, 'CREATE');

    //set the CHANGSET flag to false
    libCom.setOnChangesetFlag(context, false);

    if (NoteLibrary.didSetNoteTypeTransactionForBindingType(context)) {
        const entitySet = WCMNotesLibrary.getNotesEntitySet(context);

        return NoteLibrary.noteDownloadByParams(context, entitySet, NoteLibrary.getNoteTypeTransactionFlag(context).filter).then((result) => {
            libCom.setStateVariable(context, ConstantsLibrary.noteStateVariable, result.getItem(0));

            return NoteCreateOnCommit(context);
        });

    }

}
