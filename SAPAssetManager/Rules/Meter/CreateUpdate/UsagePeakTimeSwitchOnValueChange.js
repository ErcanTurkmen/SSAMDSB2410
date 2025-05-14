
export default function UsagePeakTimeSwitchOnValueChange(context) {
    let cell = context._control;
    let rowCells = cell.getTable().getRowCells(cell.getRow());
    let usagePeakDateCell = rowCells[3];
    usagePeakDateCell.setEditable(cell.getValue());
    return usagePeakDateCell.setValue('');
}
