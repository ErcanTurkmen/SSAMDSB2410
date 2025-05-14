import { NoteLibrary } from '../NoteLibrary';
import NoteTypeControlLibrary from './NoteTypeControlLibrary';

export default async function NoteTypeControlPickerItems(context) {
    const transactionTypeObject = NoteLibrary.getNoteTypeTransactionFlag(context);
    const service = '/SAPAssetManager/Services/AssetManager.service';
    let pickerItems = [], returnValue = '', noteTypes;

    if (NoteTypeControlLibrary.isNoteTypeControlVisible(context)) {
        if (transactionTypeObject.entitySet === 'S4BusinessPartners') {
            returnValue = 'TextType';
            noteTypes = await context.read(service, 'BPNoteTypes', 
                ['Description', 'TextType'], await NoteTypeControlLibrary.getBPNoteTypeControlQueryOptions(context));
        } else {
            returnValue = 'TextID';
            noteTypes = await context.read(service, 'ServiceNoteTypes',
                ['Description', 'TextID'], await NoteTypeControlLibrary.getNoteTypeControlQueryOptions(context));
        }

        noteTypes.forEach(noteType => {
            pickerItems.push({
                DisplayValue: noteType.Description,
                ReturnValue: noteType[returnValue],
            });
        });
    }

    return pickerItems;
}
