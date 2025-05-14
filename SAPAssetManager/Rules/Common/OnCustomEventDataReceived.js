
import scannerDispatch from '../Extensions/Scanner/ScannerDispatch';
import scannerTriggerSingleScan from '../Extensions/Scanner/ScannerTriggerSingleScan';

export default async function OnCustomEventDataReceived(context) {
    const eventData = context.getAppEventData();
    switch (eventData.EventType) {
        case 'ScanResultEvent': {
            return scannerDispatch(context, eventData.Data[0].ScanValue);
        }
        case 'HardKeyPressedEvent': {
            return scannerTriggerSingleScan(context);
        }
        default:
            break;
    }
}
