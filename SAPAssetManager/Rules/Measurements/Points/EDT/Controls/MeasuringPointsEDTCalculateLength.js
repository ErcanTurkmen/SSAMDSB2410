import { cacheCellValue } from '../MeasuringPointsEDTOnValueChange';

export default function MeasuringPointsEDTCalculateLength(context) {
    let edtTable = context._control.getTable();
    let currentRow = context._control.getRow();
    let startPointCell = edtTable.getRowCellByName(currentRow, 'StartPoint');
    let endPointCell = edtTable.getRowCellByName(currentRow, 'EndPoint');
    let lengthPointCell = edtTable.getRowCellByName(currentRow, 'Length');
    
    let startValue = startPointCell.getValue() || 0;
    let endValue = endPointCell.getValue() || 0;
    let length = Math.abs(endValue - startValue);

    lengthPointCell.setValue(length);
    cacheCellValue(context.currentPage.context.clientAPI, lengthPointCell, edtTable.getUserData().Index);

    if (length <= 0) {
        let message = context.localizeText('positive_length');
        lengthPointCell.applyValidation(message);
    } else {
        lengthPointCell.clearValidation();
    }

    if (!startValue) {
        let message = context.localizeText('start_point_is_required');
        startPointCell.applyValidation(message);
    } else {
        startPointCell.clearValidation();
    }
}
