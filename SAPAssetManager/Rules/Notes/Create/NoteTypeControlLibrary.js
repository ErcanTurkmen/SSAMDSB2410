import IsIOS from '../../Common/IsIOS';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ConstantsLibrary from '../../Common/Library/ConstantsLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import Logger from '../../Log/Logger';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import NotesListLibrary from '../List/NotesListLibrary';
import { NoteLibrary } from '../NoteLibrary';

export default class NoteTypeControlLibrary {

    /**
     * Combines Note Type control query options
     * @param {ClientAPI} context 
     * @returns {Promise<String>}
     */
    static async getNoteTypeControlQueryOptions(context) {
        const queryBuilder = new QueryBuilder();
        const orderByQuery = 'orderby=TextID';

        const notSupportedTypes = ['A', 'C', 'R']; // A - Paste, C - Display, R - Log
        const notSupportedTypesFilter = notSupportedTypes.map(type => `Changes ne '${type}'`).join(' and ');

        const existingTypes = await NotesListLibrary.fetchExistingNoteTypes(context);
        const existingTypesFilter = existingTypes.map(type => `TextID ne '${type}'`).join(' and ');

        const transactionTypeObject = NoteTypeControlLibrary.getNoteTypeTransactionObject(context);

        const defaultProcessTypeMapping = {
            'S4ServiceOrderLongTexts': context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ServiceOrderDefaultProcessType.global').getValue(),
            'S4ServiceRequestLongTexts': context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ServiceRequestDefaultProcessType.global').getValue(),
            'S4ServiceConfirmationLongTexts': context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ServiceConfirmationDefaultProcessType.global').getValue(),
            'S4ServiceQuotationLongTexts': context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ServiceOrderDefaultProcessType.global').getValue(),
        };
        const defaultProcessType = defaultProcessTypeMapping[transactionTypeObject?.longTextEntitySet];
        const processType = await NoteTypeControlLibrary.getBindingObjectProcessType(context);

        let transactionTypeFilter;
        if (processType) {
            transactionTypeFilter = `TransactionType eq '${processType}'`;
        } else if (defaultProcessType) {
            transactionTypeFilter = `TransactionType eq '${defaultProcessType}'`;
        }

        let objectTypeFilter;
        if (transactionTypeObject?.entitySet.includes('Item')) {
            objectTypeFilter = "Textobject eq 'CRM_ORDERI'";
        } else {
            objectTypeFilter = "Textobject eq 'CRM_ORDERH'";
        }

        if (objectTypeFilter) {
            queryBuilder.addFilter(objectTypeFilter);
        }

        if (transactionTypeFilter) {
            queryBuilder.addFilter(transactionTypeFilter);
        }

        if (existingTypesFilter) {
            queryBuilder.addFilter(existingTypesFilter);
        }

        queryBuilder.addFilter(notSupportedTypesFilter);
        queryBuilder.addExtra(orderByQuery);

        return queryBuilder.build();
    }
    
    /**
     * Combines BP Note Type control query options
     * @param {ClientAPI} context 
     * @returns {Promise<String>}
     */
    static async getBPNoteTypeControlQueryOptions(context) {
        const queryBuilder = new QueryBuilder();
        const orderByQuery = 'orderby=TextType';

        const existingTypes = await NotesListLibrary.fetchExistingNoteTypes(context, `${context.binding['@odata.readLink']}/S4BusinessPartnerLongText_Nav`);
        const existingTypesFilter = existingTypes.map(type => `TextType ne '${type}'`).join(' and ');

        if (existingTypesFilter) {
            queryBuilder.addFilter(existingTypesFilter);
        }

        queryBuilder.addExtra(orderByQuery);

        return queryBuilder.build();
    }

    /**
     * Checks if Note Type control visible
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static isNoteTypeControlVisible(context) {
        return IsS4ServiceIntegrationEnabled(context) && NotesListLibrary.isListNote(context);
    }

    /**
     * Validates Note Type control value (Value is mandatory when control is visible)
     * Manages control validation message
     * 
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static validateNoteTypeControl(context) {
        if (NoteTypeControlLibrary.isNoteTypeControlVisible(context)) {
            const typeControl = CommonLibrary.getControlProxy(context, 'ServiceNoteTypesListPicker');
            const type = CommonLibrary.getControlValue(typeControl);

            ResetValidationOnInput(typeControl);
            if (!type) {
                CommonLibrary.executeInlineControlError(context, typeControl, context.localizeText('field_is_required'));
                return false;
            }
        }

        return true;
    }

    /**
     * Validates Note Value control value (Value is mandatory when Note Type is selected)
     * Manages control validation message
     * 
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static validateNoteValueControl(context) {
        if (NoteTypeControlLibrary.isNoteTypeControlVisible(context)) {
            const noteControl = CommonLibrary.getControlProxy(context, 'LongTextNote');
            const note = CommonLibrary.getControlValue(noteControl);

            ResetValidationOnInput(noteControl);
            if (!note) {
                CommonLibrary.executeInlineControlError(context, noteControl, context.localizeText('field_is_required'));
                return false;
            }
        }

        return true;
    }

    /**
     * Returns Note Type control value
     * @param {ClientAPI} context 
     * @returns {String}
     */
    static getNoteTypeControlValue(context) {
        const typeControl = CommonLibrary.getControlProxy(context, 'ServiceNoteTypesListPicker');
        return CommonLibrary.getControlValue(typeControl);
    }

    /**
     * Validates if Note Value control has a value
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static noteSectionHasValue(context) {
        const noteControl = CommonLibrary.getControlProxy(context, 'LongTextNote');
        return !!CommonLibrary.getControlValue(noteControl) && noteControl.getVisible() !== false;
    }

    /**
     * Validates if Note Type control has a value
     * @param {ClientAPI} context 
     * @returns {boolean}
     */
    static isNoteTypeSelected(context) {
        if (this.isNoteTypeControlVisible(context)) {
            return !!this.getNoteTypeControlValue(context);
        }
        return false;
    }

    /**
     * Gets the NoteType state variable
     * If current page is different form the transactionTypeObject.page, resets the transactionTypeObject based on the current page name.
     * @param {IClientAPI} context
     * @returns {Object}
     */
    static getNoteTypeTransactionObject(context) {
        let transactionTypeObject = CommonLibrary.getStateVariable(context, ConstantsLibrary.transactionNoteTypeStateVariable);

        const currentPageName = CommonLibrary.getPageName(context.getPageProxy());
        if (transactionTypeObject?.page !== currentPageName) {
            const isObjectUpdated = NoteLibrary.didSetNoteTypeTransactionFlagForPage(context, currentPageName);
            if (isObjectUpdated) {
                transactionTypeObject = CommonLibrary.getStateVariable(context, ConstantsLibrary.transactionNoteTypeStateVariable);
            }
        }

        return transactionTypeObject;
    }

    /**
     * Returns if note type control editable
     * Control is editable when user creates new note or edits a local note
     * @param {IClientAPI} context 
     * @returns {boolean}
     */
    static isNoteTypeControlEditable(context) {
        const currentPageName = CommonLibrary.getPageName(context.getPageProxy());
        return currentPageName === 'NoteUpdate' ? false : true;
    }

    /**
     * Sets note field value editable if note type has a value
     * @param {IListPickerFormCellProxy} control 
     */
    static onNoteTypeControlValueChanged(control) {
        ResetValidationOnInput(control);

        const pageProxy = control.getPageProxy();
        const noteControl = CommonLibrary.getControlProxy(pageProxy, 'LongTextNote');
        noteControl.setEditable(!!CommonLibrary.getControlValue(control));
        if (IsIOS(pageProxy)) {
            pageProxy.redraw();
        }
    }

    /**
    * Returns the process type of the binding object
    * If the object does not have a process type, tries to get it from the parent object
    * @param {IClientAPI} context 
    * @returns {Promise<String>}
    */
    static async getBindingObjectProcessType(context) {
        const binding = context?.binding || {};

        // Covers the creation of a new service order with item
        if (S4ServiceLibrary.isOnSOChangeset(context)) {
            try {
                const processTypeValue = context.evaluateTargetPath('#Page:ServiceOrderCreateUpdatePage/#Control:ProcessTypeLstPkr/#SelectedValue');
                return Promise.resolve(processTypeValue);
            } catch (error) {
                Logger.error('getBindingObjectProcessType', error);
                return Promise.resolve(binding.ProcessType);
            }
        }
        
        if (S4ServiceLibrary.isOnSQChangeset(context)) {
            try {
                const processTypeValue = context.evaluateTargetPath('#Page:ServiceQuotationCreateUpdatePage/#Control:ProcessTypeLstPkr/#SelectedValue');
                return Promise.resolve(processTypeValue);
            } catch (error) {
                Logger.error('getBindingObjectProcessType', error);
                return Promise.resolve(binding.ProcessType);
            }
        }

        if (binding.ProcessType) {
            return Promise.resolve(binding.ProcessType);
        }

        let parentObjectLink;
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            parentObjectLink = binding['@odata.readLink'] + '/S4ServiceOrder_Nav';
        } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem') {
            parentObjectLink = binding['@odata.readLink'] + '/S4ServiceConfirmation_Nav';
        }

        if (parentObjectLink) {
            try {
                const parentObject = await context.read('/SAPAssetManager/Services/AssetManager.service', parentObjectLink, ['ProcessType'], '');
                return parentObject.getItem(0)?.ProcessType;
            } catch (error) {
                Logger.error('getBindingObjectProcessType', error);
                return Promise.resolve('');
            }
        }

        return Promise.resolve('');
    }

}
