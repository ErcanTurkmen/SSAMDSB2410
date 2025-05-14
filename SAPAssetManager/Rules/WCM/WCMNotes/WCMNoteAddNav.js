import WCMNotesLibrary from './WCMNotesLibrary';

export default async function WCMNoteAddNav(context) {
    if (await WCMNotesLibrary.enableNoteCreateForObject(context)) {
        return context.executeAction('/SAPAssetManager/Actions/WCM/WCMNotes/WCMNoteAddNav.action');
    }
    
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Common/GenericErrorDialog.action',
        'Properties': {
            'Title': context.localizeText('add_note'),
            'Message': getErrorMessage(context),
            'OKCaption': context.localizeText('ok'),
        },
    });
}

function getErrorMessage(context) {
    const messageKeysMapping = {
        [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue()]: 'cannot_add_notes_for_work_permit_in_current_status',
        [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue()]: 'cannot_add_notes_for_work_approval_in_current_status',
        [context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue()]: 'cannot_add_notes_for_certificate_in_current_status',
    };

    return context.localizeText(messageKeysMapping[context.binding['@odata.type']] || 'error');
}
