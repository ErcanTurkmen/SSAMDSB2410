import CommonLibrary from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

/** @param {IFormCellProxy} controlProxy  */
export default function LAMCreateUpdateValuesChangedDataCapture(controlProxy) {
    const section = CommonLibrary.GetParentSection(controlProxy);
    const lrpId = section.getControl('LRPLstPkr').getValue();

    return Promise.all([
        ...[['StartPoint', 'StartMarkerLstPkr', 'DistanceFromStart'], ['EndPoint', 'EndMarkerLstPkr', 'DistanceFromEnd']]
            .map(([control, marker, distance]) => [section.getControl(control).getValue(), section.getControl(marker).getValue().map(r => r.ReturnValue).find(i => i), section.getControl(distance)])
            .map(([val, markerVal, distance]) => setDistanceControl(markerVal, controlProxy, val, distance, lrpId)),
        controlProxy.getPageProxy().redraw(),
    ]);
}

function setDistanceControl(markerValue, controlProxy, endVal, distanceControl, lrpId) {
    if (ValidationLibrary.evalIsEmpty(markerValue) || !libLocal.isNumber(controlProxy, endVal)) {
        return undefined;
    }
    return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${markerValue}' and StartPoint ne '')`).then(linearReferencePatternItems => {
        if (ValidationLibrary.evalIsEmpty(linearReferencePatternItems)) {
            distanceControl.setValue('');
            return undefined;
        }
        const markerVal = libLocal.toNumber(controlProxy, linearReferencePatternItems.getItem(0).StartPoint);
        return distanceControl.setValue(controlProxy.formatNumber(libLocal.toNumber(controlProxy, endVal) - markerVal));
    });
}
