
export default function MetersWithActivityListOnReturning(context) {
    const sectionedTable = context.getControls()[0];
    const edtSection = sectionedTable.getSections()[0];
    edtSection.redraw(true);
}
