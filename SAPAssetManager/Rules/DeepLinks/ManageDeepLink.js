import DeepLinkConfig from './DeepLinkConfig';
import DeepLink from './DeepLink';
import CommonLibrary from '../Common/Library/CommonLibrary';
import libThis from './ManageDeepLink';
import URLModuleLibrary from '../../Extensions/URLModule/URLModuleLibrary';

export default class ManageDeepLink {
    constructor() {
        this._instance = null;
        this.errorMessage = {'key': ''};
        this._link = null;
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    getLink() {
        return this._link;
    }

    setLink(newLinkObject) {
        this._link = newLinkObject;
    }

    resetLink() {
        this.setLink(null);
    }

    init(clientAPI) {
        let linkData = this.parseEventData(clientAPI);

        if (!this.validateLinkData(linkData, clientAPI)) {
            this.resetLink();
            return Promise.reject(this.errorMessage);
        }

        this.setLink(linkData);
        CommonLibrary.setStateVariable(clientAPI, 'DeepLinkActive', true);

        return Promise.resolve(this.getLink());
    }

    static isActive(clientAPI) {
        return CommonLibrary.getStateVariable(clientAPI, 'DeepLinkActive');
    }

    parseEventData(clientAPI) {
        //"{"URL":"","URLScheme":"samclient:","Parameters":{}}"
        //"{"URL":"update/MyWorkOrderHeaders/key","URLScheme":"samclient:","Parameters":{"OrderDescription":"test", returnUri:""}}"
        let dataJSONString = clientAPI.getAppEventData();
        let data;

        try {
            data = JSON.parse(dataJSONString);
        } catch (error) {
            return null;
        }

        let splittedURL = data.URL.split('/');

        let action = splittedURL[0];
        let entity = splittedURL.length > 1 ? splittedURL[1] : '';

        let key = splittedURL.length > 2 ? decodeURI(splittedURL[2]) : '';

        //url shema: ActionName/EntitySetName/Key
        //url with simple key: update/MyWorkOrderHeaders/4008338
        //url with complex key: update/MyWorkOrderOperations/OrderId='4008338',OperationNo='0010'
        //simple key needs to wrap with quotes for the read query
        //read with simple key: get MyWorkOrderHeaders('4008338')
        //read with complex key: get MyWorkOrderOperations(OrderId='4008338',OperationNo='0010')
        if (key && !key.includes(',') && !key.includes('lodata')) {
            key = `'${key}'`;
        }

        let callback = data.Parameters.returnUri;

        delete data.Parameters.id;
        delete data.Parameters.returnUri;

        for (const [paramKey, paramValue] of Object.entries(data.Parameters)) {
            data.Parameters[paramKey] = decodeURI(paramValue);
        }

        return new DeepLink(action, entity, key, data.Parameters, callback);
    }

    validateLinkData(link, clientAPI) {
        if (!link || !(link.constructor && link.constructor.name === 'DeepLink')) {
            this.errorMessage = {'key': 'deep_link_invalid_url'};
            return false;
        }

        return this._isActionValid(link.getActionType()) && this._isEntityValid(clientAPI, link.getEntity()) && this._isIdValid(link.getKey(), link.getActionType());
    }

    _isEntityValid(clientAPI, entity) {
        if (!entity) {
            this.errorMessage = {'key': 'deep_link_invalid_url'};
            return false;
        }

        let config = DeepLinkConfig.getEntityConfig(clientAPI)[entity];

        if (!config) {
            this.errorMessage = {'key': 'deep_link_invalid_entity'};
            return false;
        }

        return true;
    }

    _isActionValid(action) {
        if (!action || !Object.keys(DeepLinkConfig.getActionsConfig()).includes(action)) {
            this.errorMessage = '';
            return false;
        }
        return true;
    }

    _isIdValid(id, action) {
        if (!action) {
            this.errorMessage = {'key': 'deep_link_invalid_action'};
            return false;
        }

        let actionConfig = DeepLinkConfig.getActionsConfig()[action];
        if (actionConfig.idRequired && !id) {
            this.errorMessage = {'key': 'deep_link_invalid_url'};
            return false;
        }

        return true;
    }

    _returnAction(result, clientAPI, config) {
        if (result.length) {
            clientAPI.setActionBinding(result.getItem(0));
            return config.viewAction(clientAPI, true, result.getItem(0)['@odata.id']);
        }
        return Promise.reject({'key': 'deep_link_invalid_action'});
    }

    static getBindingFromVariables(clientAPI) {
        CommonLibrary.setStateVariable(clientAPI, 'DeepLinkActive', false);
        return CommonLibrary.getStateVariable(clientAPI, 'DeepLinkObject');
    }

    getActionBindingWithParameters(clientAPI, customBinding) {
        let binding = {};

        if (this.getLink() && this.getLink().getParameters()) {
            if (customBinding) {
                binding = Object.assign(binding, customBinding);
            }
            binding = Object.assign(binding, this.getLink().getParameters());

            CommonLibrary.setStateVariable(clientAPI, 'DeepLinkObject', binding);
        }

        return binding;
    }

    replaceAndSetActionBindingWithParameters(clientAPI, customBinding, parametersToExclude) {
        if (this.getLink() && this.getLink().getParameters()) {
            let binding = {};
            if (customBinding) {
                binding = Object.assign(binding, customBinding);
            }
            const parameters = Object.assign({}, this.getLink().getParameters());
            if (parametersToExclude) {
                parametersToExclude.forEach(name => delete parameters[name]);
            }
            binding = Object.assign(binding, parameters);

            CommonLibrary.setStateVariable(clientAPI, 'DeepLinkObject', binding);

            if (clientAPI.setActionBinding) {
                clientAPI.setActionBinding(binding);
            } else {
                clientAPI.getPageProxy().setActionBinding(binding);
            }
        }
    }

    getEntityConfig(clientAPI, link) {
        let config = DeepLinkConfig.getEntityConfig(clientAPI)[link.getEntity()];

        if (!config) {
            this.errorMessage = {'key': 'deep_link_invalid_entity'};
            return Promise.reject(this.errorMessage);
        }

        return Promise.resolve(config);
    }

    executeViewAction(clientAPI, link) {
        return this.getEntityConfig(clientAPI, link).then((config) => {
            if (!config.viewAction) {
                this.errorMessage = {'key': 'deep_link_invalid_action'};
                return Promise.reject(this.errorMessage);
            }

            return Promise.resolve(config.isViewActionAllowed(clientAPI)).then(isViewAllowed => {
                if (isViewAllowed) {
                    if (link.getKey()) {
                        let readLink = `${link.getEntity()}(${link.getKey()})`;
                        let queryOptions = config.getViewQueryOptions ? config.getViewQueryOptions(clientAPI) : '';

                        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], queryOptions)
                            .then(function(result) {
                                return libThis.getInstance()._returnAction(result, clientAPI, config);
                            })
                            .catch((error) => {
                                return Promise.reject(error);
                            });
                    } else {
                        return config.viewAction(clientAPI);
                    }
                }
                return Promise.reject({'key': 'deep_link_invalid_action'});
            });
        });
    }

    executeCreateAction(clientAPI, link) {
        return this.getEntityConfig(clientAPI, link).then((config) => {
            if (!config.createAction) {
                this.errorMessage = {'key': 'deep_link_invalid_action'};
                return Promise.reject(this.errorMessage);
            }

            return Promise.resolve(config.isCreateActionAllowed(clientAPI)).then(isCreateAllowed => {
                if (isCreateAllowed) {
                    return config.createAction(clientAPI);
                }
                return Promise.reject({'key': 'deep_link_invalid_action'});
            });
        });
    }

    executeUpdateAction(clientAPI, link) {
        return this.getEntityConfig(clientAPI, link).then((config) => {
            if (!config.updateAction) {
                this.errorMessage = {'key': 'deep_link_invalid_action'};
                return Promise.reject(this.errorMessage);
            }

            let readLink = `${link.getEntity()}(${link.getKey()})`;
            let queryOptions = config.getViewQueryOptions ? config.getViewQueryOptions(clientAPI) : '';

            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], queryOptions)
                .then(function(result) {
                    if (result.length > 0) {
                        return Promise.resolve(config.isUpdateActionAllowed(clientAPI, result.getItem(0))).then(isUpdateAllowed => {
                            if (isUpdateAllowed) {
                                ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(clientAPI, result.getItem(0));
                                return config.updateAction(clientAPI, result.getItem(0)['@odata.id']);
                            }
                            return Promise.reject({'key': 'deep_link_invalid_action'});
                        });
                    }
                    return Promise.reject({'key': 'deep_link_invalid_action'});
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        });
    }

    //This is a temporary workaround for opening URL due to nativescript issue so keeping the clientAPI parameter
    // eslint-disable-next-line no-unused-vars
    executeCallback(clientAPI, result = 'success') {
        setTimeout(() => {
            let callbackUri = this.getLink().getCallback();
            let action = this.getLink().getActionType();

            this.resetLink();

            if (callbackUri !== undefined) {
                URLModuleLibrary.openUrl(callbackUri + `://message?action=${action}&result=${result}`);
            }
        }, 2000);
    }

    setObjectVariables(clientAPI) {
        let link = this.getLink();
        if (link) {
            return this.getEntityConfig(clientAPI, link).then((config) => {
                if (config.setObjectVariables) {
                    return config.setObjectVariables(clientAPI, link.getParameters());
                } else {
                    return Promise.resolve();
                }
            });
        }
        return Promise.resolve();
    }
}
