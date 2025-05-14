import EDTHelper from './MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTOnSkipChange(context) {
    let pageAPI = context.currentPage.context.clientAPI;
    let cell = context._control;
    let sectionIndex = cell.getTable().getUserData().Index;

    let cachedRowBinding = EDTHelper.getCachedRowBinding(pageAPI, sectionIndex, cell.getTable().getRowBindings()[cell.getRow()]);
    if (cachedRowBinding) {
        let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(pageAPI, cachedRowBinding);
        cachedMeasurementDoc._skipped = context.getValue();
    }
}
