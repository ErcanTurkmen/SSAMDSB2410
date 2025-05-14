
import scannerLibrary from '../../Extensions/ScannerModule/ScannerLibrary';

export default function ScanAllButtonOnPress(context) {
    if (scannerLibrary.isScannerAppInstalled(context)) {
        scannerLibrary.triggerScan(context, scannerLibrary.SCAN_MODE_MULTI_SCAN, scannerLibrary.SELECTION_AUTOMATIC);
        return Promise.resolve(true);
    }
    return context.executeAction('/SAPAssetManager/Actions/Extensions/BarcodeScannerNav.action');
}
