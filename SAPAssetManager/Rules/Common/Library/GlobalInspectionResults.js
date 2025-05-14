/**
 * Static class that has all of the getter and setter of the global variable
 */
export class InspectionValuationVar {

    static setInspectionResultValuations(value) {
        this._globalInspectionResultValuations = value;
    }

    static getInspectionResultValuations() {
        return this._globalInspectionResultValuations;
    }
}
