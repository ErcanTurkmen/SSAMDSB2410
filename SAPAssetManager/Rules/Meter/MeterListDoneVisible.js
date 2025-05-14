export default function MeterListDoneVisible(clientAPI) {
    return clientAPI.getPageProxy().getControl('SectionedTable').getSections()[0]?.getSelectionMode() === 'Multiple';
}
