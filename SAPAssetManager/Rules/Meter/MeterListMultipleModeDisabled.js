export default function MeterListMultipleModeDisabled(clientAPI) {
    return clientAPI.getPageProxy().getControl('SectionedTable')?.getSections()[0].getSelectionMode() !== 'Multiple';
}
