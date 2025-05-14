import { NoteLibrary as NoteLib } from './NoteLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import Constants from '../Common/Library/ConstantsLibrary';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import NotesListLibrary from './List/NotesListLibrary';
import NoteTypeControlLibrary from './Create/NoteTypeControlLibrary';

export default async function NoteCreateOnCommit(clientAPI) {
    let type = NoteLib.getNoteTypeTransactionFlag(clientAPI);
    if (!type) {
        throw new TypeError('Note Transaction Type must be defined');
    }

    const noteTypeValid = NoteTypeControlLibrary.validateNoteTypeControl(clientAPI);
    const noteValueValid = NoteLib.validateNoteFieldValue(clientAPI);
    if (!noteTypeValid || !noteValueValid) return Promise.reject();

    let note = libCommon.getStateVariable(clientAPI, Constants.noteStateVariable);
    if (NotesListLibrary.isListNoteCreationAction(clientAPI)) {
        note = '';
    }

    if (note) {
        if (IsCompleteAction(clientAPI)) {
            WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                data: JSON.stringify(note),
                link: note['@odata.editLink'],
                value: clientAPI.localizeText('done'),
            });
        }
        if (type.noteUpdateAction) {
            libCommon.setStateVariable(clientAPI, Constants.stripNoteNewTextKey, false);
            return clientAPI.executeAction(type.noteUpdateAction).then(() => {
                libCommon.setOnCreateUpdateFlag(clientAPI, '');
            });
        }
    } else if (type.noteCreateAction) {
        const createPromise = libVal.evalIsEmpty(type.noteCreateActionProperties) ?
            clientAPI.executeAction(type.noteCreateAction) :
            clientAPI.executeAction({
                'Name': type.noteCreateAction, 
                'Properties': type.noteCreateActionProperties,
            });

        return createPromise.then((result) => {
            if (IsCompleteAction(clientAPI)) {
                WorkOrderCompletionLibrary.updateStepState(clientAPI, 'note', {
                    data: result.data,
                    link: JSON.parse(result.data)['@odata.editLink'],
                    value: clientAPI.localizeText('done'),
                });
            }
            libCommon.setOnCreateUpdateFlag(clientAPI, '');
        });
    }

    return Promise.reject();
}
