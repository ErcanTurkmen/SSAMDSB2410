import CommonLibrary from '../../Common/Library/CommonLibrary';
import ConstantsLibrary from '../../Common/Library/ConstantsLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default class NotesListLibrary {

    /**
     * Checks if the note transaction type supports multiple notes
     * @param {ClientApi} context 
     * @returns {boolean}
     */
    static isListNote(context) {
        const transactionTypeObject = CommonLibrary.getStateVariable(context, ConstantsLibrary.transactionNoteTypeStateVariable) || {};
        const listEntitySets = ['S4ServiceOrderLongTexts', 'S4ServiceRequestLongTexts', 'S4ServiceConfirmationLongTexts', 'S4BusinessPartnerLongTexts', 'S4ServiceQuotationLongTexts'];

        return !!listEntitySets.find(entitySetName => entitySetName === transactionTypeObject.longTextEntitySet);
    }

    /**
     * Checks if a note is local
     * @param {ClientApi} context 
     * @returns {boolean}
     */
    static isNoteLocal(context) {
        const isLocal = CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        return isLocal;
    }

    /**
     * Checks if a note has changes
     * @param {ClientApi} context 
     * @returns {boolean}
     */
    static isNoteHasChanges(context) {
        return !!context.binding['@sap.hasPendingChanges'];
    }

    /**
     * Checks if a note is a log file
     * @param {ClientApi} context 
     * @returns {boolean}
     */
    static isLogNote(context) {
        const LogNoteType = context.getGlobalDefinition('/SAPAssetManager/Globals/Note/LogNoteType.global').getValue();
        return context.binding.TextID === LogNoteType;
    }

    /**
     * Creates list's query options 
     * @param {ClientApi} context 
     * @param {boolean} useOrderBy to add orderby
     * @param {boolean} useDynamicFilters to use quick filters
     * @returns {String}
     */
    static getNotesListQuery(context, useOrderBy = true, useDynamicFilters = false) {
        const queryBuilder = new QueryBuilder();
        const orderByQuery = 'orderby=LastChangeDate desc,LastChangeTime desc';

        if (useDynamicFilters) {
            const dynamicFilterQuery = CommonLibrary.GetSectionedTableFilterTerm(context.getPageProxy().getControl('SectionedTable'));
            if (dynamicFilterQuery) {
                queryBuilder.addFilter(dynamicFilterQuery);
            }
        }

        if (useOrderBy) {
            queryBuilder.addExtra(orderByQuery);
        }

        return queryBuilder.build();
    }

    /**
     * Reads Note Type by TextID
     * @param {ClientApi} context 
     * @param {String} textID 
     * @param {String} textObjectType 
     * @returns {Promise<ServiceNoteType>}
     */
    static async fetchNoteType(context, textID, textObjectType) {
        if (textID && textObjectType) {
            try {
                const noteTypes = await context.read('/SAPAssetManager/Services/AssetManager.service', 'ServiceNoteTypes', [], `$filter=TextID eq '${textID}' and Textobject eq '${textObjectType}'`);
                return noteTypes.length ? noteTypes.getItem(0) : null;
            } catch {
                return null;
            }
        }

        return Promise.resolve(null);
    }
    
    /**
     * Reads Business Partner Note Type by TextType
     * @param {ClientApi} context 
     * @param {String} textType 
     * @param {String} textObject 
     * @returns {Promise<ServiceNoteType>}
     */
    static async fetchBPNoteType(context, textType) {
        if (textType) {
            try {
                const noteTypes = await context.read('/SAPAssetManager/Services/AssetManager.service', 'BPNoteTypes', [], `$filter=TextType eq '${textType}'`);
                return noteTypes.length ? noteTypes.getItem(0) : null;
            } catch {
                return null;
            }
        }

        return Promise.resolve(null);
    }

    /**
     * Is business partner note
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static isBPNote(context) {
        return context.binding['@odata.type'] === '#sap_mobile.S4BusinessPartnerLongText';
    }
    
    /**
     * Is on create of a list note
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static isListNoteCreationAction(context) {
        return IsS4ServiceIntegrationEnabled(context) && NotesListLibrary.isListNote(context) && CommonLibrary.IsOnCreate(context);
    }

    /**
     * Downloads existing note types
     * 
     * If page name not NoteAdd this means: user creates a new object or user edits an existing note. 
     * In the first case no notes.
     * In the second case note type is only in display mode.
     * 
     * @param {clientAPI} context
     * @returns {Promise<Array>}
     */
    static async fetchExistingNoteTypes(context, customEntitySet, isOnCreate = true) {
        const pageName = CommonLibrary.getPageName(context.getPageProxy());
        if (isOnCreate && !['RejectReason', 'NoteAdd'].includes(pageName)) return Promise.resolve([]);

        const entitySet = customEntitySet ? customEntitySet : context.binding['@odata.readLink'] + '/LongText_Nav';
        try {
            const notes = await context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, ['TextID'], '');
            return notes.map(note => note.TextID);
        } catch {
            return [];
        }
    }
}
