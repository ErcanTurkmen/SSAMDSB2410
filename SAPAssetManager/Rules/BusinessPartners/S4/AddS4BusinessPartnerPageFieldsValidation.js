import Logger from '../../Log/Logger';
import NoteTypeControlLibrary from '../../Notes/Create/NoteTypeControlLibrary';
import { NoteLibrary } from '../../Notes/NoteLibrary';

export default function AddS4BusinessPartnerPageFieldsValidation(context) {
    const validationActions = [Promise.resolve(true)];

    // check note, run the note type validation rule if there is a note value
    if (NoteTypeControlLibrary.noteSectionHasValue(context)) {
        validationActions.push(NoteTypeControlLibrary.validateNoteTypeControl(context));
    }
   
    if (NoteTypeControlLibrary.getNoteTypeControlValue(context)) {
        validationActions.push(NoteLibrary.validateNoteFieldValue(context));
    }

    return Promise.all(validationActions).then((results) => {
        const pass = results.reduce((total, value) => total && value);
        return pass;
    }).catch((error) => {
        Logger.error('AddS4BusinessPartnerPageFieldsValidation', error);
        return false;
    });
}
