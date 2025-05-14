import NotesListLibrary from './NotesListLibrary';

export default function NoteAccessoryButtonIcon(context) {
    if (NotesListLibrary.isLogNote(context)) return '';
    return '$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png, /SAPAssetManager/Images/edit-accessory.android.png)';
}
