import EDTHelper from '../MeasuringPointsEDTHelper';
import MeasuringPointsEDTOnValueChange from '../MeasuringPointsEDTOnValueChange';

export default function MeasuringPointsEDTValueControlOnValueChange(context) {
    const pageAPI = context.currentPage.context.clientAPI;
    const cell = context._control;

    const sectionIndex = cell.getTable().getUserData().Index;
    const rowIndex = cell.getRow();
    let cachedRowBinding = EDTHelper.getCachedRowBinding(pageAPI, sectionIndex, cell.getTable().getRowBindings()[rowIndex]);
    let cachedMeasurementDoc = EDTHelper.getLatestMeasurementDoc(pageAPI, cachedRowBinding);

    const isReadingValidationNeeded = EDTHelper.isReadingValueMandatory(cachedRowBinding, cachedMeasurementDoc);
    if (isReadingValidationNeeded) { 
        const cellValue = cell.getValue();
        if (cellValue) {
            const orderObjNum = EDTHelper.getOrderObjectNumberFromContext(pageAPI);
            cachedMeasurementDoc.OrderObjNum = orderObjNum;
        } else {
            cachedMeasurementDoc.OrderObjNum = '';
        }

        EDTHelper.updatedCachedRow(pageAPI, sectionIndex, cachedRowBinding);
    }


    return MeasuringPointsEDTOnValueChange(context);
}
