import LocalizationLibrary from '../../../../../Common/Library/LocalizationLibrary';
import EDTHelper from '../../MeasuringPointsEDTHelper';
import MeasuringPointsEDTOnValueChange from '../../MeasuringPointsEDTOnValueChange';

export default async function MeasuringPointsEDTDistanceOnValueChange(context) {
    await MeasuringPointsEDTOnValueChange(context);

    const pageAPI = context.currentPage.context.clientAPI;
    const cell = context._control;
  
    switch (cell._cell.Property) { 
        case 'LAMObjectDatum_Nav/StartPoint':
        case 'LAMObjectDatum_Nav/EndPoint':
        case 'LAMObjectDatum_Nav/StartMarker':
        case 'LAMObjectDatum_Nav/EndMarker':
        case 'LAMObjectDatum_Nav/StartMarkerDistance':
        case 'LAMObjectDatum_Nav/EndMarkerDistance': {
            const sectionIndex = cell.getTable().getUserData().Index;
            const rowIndex = cell.getRow();
            let cachedRowBinding = EDTHelper.getCachedRowBinding(pageAPI, sectionIndex, cell.getTable().getRowBindings()[rowIndex]);
            let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(pageAPI, cachedRowBinding);
        
            await updateLinearDataDistance(pageAPI, cachedMeasurementDoc, cell);
            EDTHelper.updatedCachedRow(pageAPI, sectionIndex, cachedRowBinding);
        }
    }
}

async function updateLinearDataDistance(context, measurementDoc, currentCell) {
    const startPoint = measurementDoc.LAMObjectDatum_Nav.StartPoint;
    const endPoint = measurementDoc.LAMObjectDatum_Nav.EndPoint;
    const lrpId = measurementDoc.LAMObjectDatum_Nav.LRPId;
    const startMarkerValue = measurementDoc.LAMObjectDatum_Nav.StartMarker;
    const endMarkerValue = measurementDoc.LAMObjectDatum_Nav.EndMarker;

    const distanceFromStartCell = currentCell.getTable().getRowCellByName(currentCell.getRow(), 'StartMarkerDistance');
    const startDistance = await getLinearDataDistance(context, lrpId, startPoint, startMarkerValue);
    distanceFromStartCell.setValue(startDistance, false);
    measurementDoc.LAMObjectDatum_Nav.StartMarkerDistance = startDistance;

    const distanceFromEndCell = currentCell.getTable().getRowCellByName(currentCell.getRow(), 'EndMarkerDistance');
    const endDistance = await getLinearDataDistance(context, lrpId, endPoint, endMarkerValue);
    
    distanceFromEndCell.setValue(endDistance, false);
    measurementDoc.LAMObjectDatum_Nav.EndMarkerDistance = endDistance;
}

async function getLinearDataDistance(context, lrpId, point, marker) {
    let distance = 0;

    if (lrpId && marker) {
        let pattern = await context.read('/SAPAssetManager/Services/AssetManager.service', 'LinearReferencePatternItems', [], `$filter=(LRPId eq '${lrpId}' and Marker eq '${marker}' and StartPoint ne '')`).then(result => {
            return result && result.length > 0 ? result.getItem(0) : null;
        });

        if (pattern) {
            let markerValue = LocalizationLibrary.toNumber(context, pattern.StartPoint);
            distance = LocalizationLibrary.toNumber(context, point) - markerValue;
        }
    }

    return Promise.resolve(distance);
}
