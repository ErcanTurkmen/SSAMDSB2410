import WCMNotesLibrary from '../WCM/WCMNotes/WCMNotesLibrary';

/**
* Show/hide Note edit button based on parent object
* @param {IClientAPI} context
*/

export default async function ShowNoteEdit(context) {
     // Enable note creation depending on the entity set
     const entityName = context.binding['@odata.type'].split('.')[1];
     switch (entityName) {
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue().split('.')[1]:
        case 'PurchaseOrderHeader':
            return false;
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue().split('.')[1]:
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue().split('.')[1]:
        case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue().split('.')[1]:
            return WCMNotesLibrary.enableNoteCreateForSpecificTextType(context);       
        default:
            return true;
     }
}
