import scannerLibrary from '../../../Extensions/ScannerModule/ScannerLibrary';

export default function ScannerTriggerSingleScan(context) {
    scannerLibrary.triggerScan(context,
        scannerLibrary.SCAN_MODE_SINGLE_SCAN, scannerLibrary.SELECTION_AUTOMATIC);
}
