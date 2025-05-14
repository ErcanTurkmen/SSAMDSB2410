
export default class DeepLink {
    constructor(action, entity, key, parameters, callback) {
        this._actionType = action;
        this._entity = entity;
        this._key = key;
        this._parameters = parameters;
        this._callback = callback;
    }

    getActionType() {
        return this._actionType;
    }

    getEntity() {
        return this._entity;
    }

    getKey() {
        return this._key;
    }

    getParameters() {
        return this._parameters;
    }

    getCallback() {
        return this._callback;
    }
}
