
import resetPeriodicAutoSync from './ResetPeriodicAutoSync';
import scannerCleanup from '../Extensions/Scanner/ScannerCleanup';

export default function ExitEventHandler(context) {
    resetPeriodicAutoSync(context);
    scannerCleanup(context);
    // kill process after exiting
    if (context.nativescript.platformModule.isAndroid) {
        // eslint-disable-next-line no-undef
        android.os.Process.killProcess(android.os.Process.myPid());
    }
}
