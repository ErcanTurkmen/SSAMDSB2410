import { redrawToolbar } from '../../../Common/DetailsPageToolbar/ToolbarRefresh';

export default function OperationalItemDetailsOnCustomEventDataReceived(context) {
    const { Data, EventType } = context.getAppEventData();
    if (EventType === 'RedrawOperationalItemDetailsPage' && Data) {
        context.getControl('SectionedTable').redraw();
        redrawToolbar(context);
    }
}
