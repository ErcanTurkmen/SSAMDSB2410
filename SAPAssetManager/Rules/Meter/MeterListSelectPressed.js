import CommonLibrary from '../Common/Library/CommonLibrary';

export default function MeterListSelectPressed(context) {
    const pageProxy = context.getPageProxy();

    const isMultipleMode = pageProxy.getControl('SectionedTable')?.getSections()[0].getSelectionMode() !== 'Multiple';
    CommonLibrary.removeStateVariable(context, 'selectedMeters');
    pageProxy.getControl('SectionedTable').getSections()[0].setSelectionMode(isMultipleMode ? 'Multiple' : 'None');
}
