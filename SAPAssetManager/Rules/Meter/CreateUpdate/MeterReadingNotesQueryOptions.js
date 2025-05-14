import MeterLibrary from '../Common/MeterLibrary';

export default function MeterReadingNotesQueryOptions(context) {
    let procType = '';

    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();
    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
    switch (MeterLibrary.getMeterTransactionType(context)) {
        case INSTALL_EDIT:
        case INSTALL:
            procType = 'I';
            break;
        case REMOVE_EDIT:
        case REMOVE:
            procType = 'R';
            break;
        default:
            break;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadingNotes', [], `$filter=ProcessType eq '*' or ProcessType eq '${procType}'&$orderby=NoteID`).then(function(results) {
        let ids = new Set();

        for (let i = 0; i < results.length; i ++) {
            ids.add(results.getItem(i).NoteID);
        }

        let filterString = false;
        if (ids.size) {
            filterString = [...ids].map(id => `(NoteID eq '${id}' and ProcessType eq '${procType}')`).join(' or ');
        }

        return '$filter=' + filterString;
    });
}
