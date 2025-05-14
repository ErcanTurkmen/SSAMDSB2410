import Logger from '../Log/Logger';

export default class S4ErrorsLibrary {

    /**
     * Checks if S4 object contains errors in the binding
     * 
     * @param {{getBindingObject(): S4ServiceOrder/S4ServiceItem/S4ServiceQuotation/S4ServiceQuotationItem}} clientApi 
     * @returns {boolean}
     */
    static isS4ObjectHasErrorsInBinding(clientApi) {
        const errors = S4ErrorsLibrary.getS4ErrorsArrayFromBinding(clientApi);
        return errors?.length > 0;
    }

    /**
     * Count S4 object errors from the binding
     * 
     * @param {{getBindingObject(): S4ServiceOrder/S4ServiceItem/S4ServiceQuotation/S4ServiceQuotationItem}} clientApi 
     * @returns {number}
     */
    static countS4ObjectErrorsFromBinding(clientApi) {
        const errors = S4ErrorsLibrary.getS4ErrorsArrayFromBinding(clientApi);
        return errors.length;
    }

    /**
     * Returns S4 object errors array from the binding
     * 
     * @param {{getBindingObject(): S4ServiceOrder/S4ServiceItem/S4ServiceQuotation/S4ServiceQuotationItem}} clientApi 
     * @returns {Array<S4ServiceErrorMessage>}
     */
    static getS4ErrorsArrayFromBinding(clientApi) {
        const binding = clientApi.getBindingObject();
        if (!binding) return [];

        let errors = binding.S4ServiceErrorMessage_Nav || [];
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem' || binding['@odata.type'] === '#sap_mobile.S4ServiceQuotationItem') {
            errors = S4ErrorsLibrary.filterErrorMessagesByItemNo(errors, binding.ItemNo);
        }

        return errors;
    }

    /**
     * Filters errors array by the ItemNo in the message
     * 
     * @param {Array<S4ServiceErrorMessage>} errorMessages 
     * @param {String} itemNo
     * @returns {Array<S4ServiceErrorMessage>}
     */
    static filterErrorMessagesByItemNo(errorMessages, itemNo) {
        const filteredMessages = errorMessages.filter(error => {
            return this.isMessageAssociatedWithItem(error.Message, itemNo);
        });

        return filteredMessages;
    }

    /**
     * Checks if massage contains the ItemNo
     * 
     * @param {String} message 
     * @param {String} itemNo
     * @returns {boolean}
     */
    static isMessageAssociatedWithItem(message, itemNo) {
        if (!message || !itemNo) return false;

        const messagePattern = /\w+ (\d+):.+/; // Item 10: Contains errors
        const parsedMessage = message.match(messagePattern);
        if (parsedMessage) {
            const messageItemNo = parsedMessage[1]?.padStart(6, '0');
            return itemNo === messageItemNo;
        }
        return false;
    }

    /**
     * Checks if related S4 Order has errors
     * 
     * @param {{getBindingObject(): S4ServiceOrder/S4ServiceItem/S4ServiceConfirmation}} clientApi 
     * @returns {Promise<boolean>}
     */
    static async isServiceOrderContainsErrors(clientApi, bindingObject) {
        const binding = bindingObject || clientApi.getBindingObject();
        if (binding) {
            let orderReadLink = binding['@odata.readLink'];
            if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' && binding.S4ServiceErrorMessage_Nav) {
                return Promise.resolve(binding.S4ServiceErrorMessage_Nav.length > 0);
            } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                orderReadLink = binding['@odata.readLink'] + '/S4ServiceOrder_Nav';
            } else if (binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
                return Promise.resolve(false);
            }

            const errorsCount = await S4ErrorsLibrary.countS4ObjectErrors(clientApi, orderReadLink);
            return errorsCount > 0;
        }

        return Promise.resolve(false);
    }

    /**
    * Counts S4 Object Errors
    * 
    * @param {clientApi} clientApi 
    * @param {String} readLink 
    * @returns {Promise<number>}
    */
    static countS4ObjectErrors(clientApi, readLink) {
        if (!readLink) return Promise.resolve(0);

        return clientApi.count('/SAPAssetManager/Services/AssetManager.service', readLink + '/S4ServiceErrorMessage_Nav', '')
            .catch(error => {
                Logger.error('countS4ObjectErrors', error);
                return Promise.resolve(0);
            });
    }

}
