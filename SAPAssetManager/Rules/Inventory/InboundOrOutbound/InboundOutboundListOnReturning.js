import getCaptionState from '../Common/GetCaptionStateForListPage';

export default function InboundOutboundListOnReturning(context) {

    getCaptionState(context, 'InboundOutboundListPage');

    let pageProxy = context.evaluateTargetPathForAPI('#Page:InboundOutboundListPage');
    let table = pageProxy.getControl('SectionedTable');
    if (table) {
        table.getSections()[0].redraw(true);
    }
}
