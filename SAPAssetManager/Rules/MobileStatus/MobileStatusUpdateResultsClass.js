
export const SKIP_ALL_FLAG = '_skip_all';
export default class MobileStatusUpdateResultsClass {
    constructor() {
        this._instance = null;
        this._actionResults = {};
        this[SKIP_ALL_FLAG] = false;
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    resetAll() {
        this._actionResults = {};
        this[SKIP_ALL_FLAG] = false;
    }

    saveActionResult(resultName, result) {
        this._actionResults[resultName] = result;
    }
    
    getActionResult(resultName) {
        return this._actionResults[resultName];
    }

    isSkipAllActive() {
        return this[SKIP_ALL_FLAG];
    }
    
    setSkipAll(value) {
        this[SKIP_ALL_FLAG] = value;
    }
}
