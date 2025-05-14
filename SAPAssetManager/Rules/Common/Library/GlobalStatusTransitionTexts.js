/**
 * Static class that has all of the getter and setter of the global variable
 */
export class StatusTransitionTextsVar {

    static setStatusTransitionTexts(value, objectType) {
        this._statusTransitionTexts = {
            ...(this._statusTransitionTexts || {}),
            [objectType]: {
                ...(this._statusTransitionTexts?.[objectType] || {}),
                ...value,
            },
        };
    }

    static getStatusTransitionTexts(objectType) {
        return this._statusTransitionTexts?.[objectType];
    }
}
