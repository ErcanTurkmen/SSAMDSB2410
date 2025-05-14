import NotesListLibrary from '../Notes/List/NotesListLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import NotesListViewEntitySet from '../Notes/List/NotesListViewEntitySet';

/**
* Returns if Add Note action is available for BP. We can only add note, if there's at least one available note type.
* @param {IClientAPI} context
*/
export default async function IsBusinessPartnerAddNoteVisibile(context) {
    if (!IsS4ServiceIntegrationEnabled(context)) {
        return false;
    }

    const existingTypes = await NotesListLibrary.fetchExistingNoteTypes(context, NotesListViewEntitySet(context), false);
    const existingTypesFilter = existingTypes.map(type => `TextType ne '${type}'`).join(' and ');
    const availableTypesCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'BPNoteTypes', `$filter=${existingTypesFilter}`);

    return availableTypesCount > 0;
}
