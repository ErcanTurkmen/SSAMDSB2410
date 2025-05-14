
export default class ExtendedPropertiesStore {
    constructor() {
        this._instance = null;
        this._data = {};
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    saveData(propretyName, data) {
        if (!propretyName) return;
        if (!this._data) this._data = {};

        this._data[propretyName] = data;
    }

    getData() {
        return this._data;
    }
}
