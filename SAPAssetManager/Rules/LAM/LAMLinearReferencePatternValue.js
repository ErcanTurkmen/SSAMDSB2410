import ValidationLibrary from '../Common/Library/ValidationLibrary';

/** @param {IControlProxy} controlProxy */
export default function LAMLinearReferencePatternValue(controlProxy) {
    /** @type {MeasuringPoint} */
    const binding = controlProxy.binding;
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/LAMObjectDatum_Nav', [], '').then(lamObjectDatums => {
        if (ValidationLibrary.evalIsEmpty(lamObjectDatums)) {
            return '';
        }
        /** @type {LAMObjectDatum} */
        const LAMData = lamObjectDatums.getItem(0);
        return LAMData.LRPId;
    });
}
