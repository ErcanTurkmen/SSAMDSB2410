import NotesListLibrary from './NotesListLibrary';

export default async function NoteType(context) {
    const textObjectType = context.binding.ItemNo && context.binding.ItemNo !== '000000' ? 'CRM_ORDERI' : 'CRM_ORDERH';
    const noteType = await NotesListLibrary.fetchNoteType(context, context.binding.TextID, textObjectType);
    return noteType?.Description || '';
}
