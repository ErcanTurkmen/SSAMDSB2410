export default function SerialNumDisable(context, quantity) {
    if (!context.getPageProxy().getControl('SectionedTable')) {
        return '';
    }
    const serialPicker = context.getPageProxy().getControl('SectionedTable').getControl('SerialNum');
    const scanAll = context.getPageProxy().getControl('SectionedTable').getControl('ScanButton');
    serialPicker.setEditable(quantity);
    scanAll.setEnabled(quantity);
}

