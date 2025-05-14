import NotesListLibrary from './NotesListLibrary';

export default async function BPNoteType(context) {
    const noteType = await NotesListLibrary.fetchBPNoteType(context, context.binding?.TextID);
    return noteType?.Description || '';
}
