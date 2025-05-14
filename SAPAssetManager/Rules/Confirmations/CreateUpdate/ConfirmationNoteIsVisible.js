export default function ConfirmationNoteIsVisible(clientAPI) {
    let binding = clientAPI.binding;

    if (binding.IsOnCreate) {
        return true;
    } else {
        // As per the ConfirmationCreateUpdate page, the note should only be visible if the local confirmation has a note.
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'ConfirmationLongTexts', [], `$filter=ConfirmationNum eq '${binding.ConfirmationNum}'`).then(longTextArray => {
            return longTextArray.length > 0;
        });

    }
}
