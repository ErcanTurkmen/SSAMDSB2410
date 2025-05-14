
import scannerLibrary from '../../Extensions/ScannerModule/ScannerLibrary';
import edtSoftInputModeConfig from '../Extensions/EDT/EDTSoftInputModeConfig';
import scanAllButtonVisibility from '../Parts/ScanAllButtonVisibility';
import libCom from '../Common/Library/CommonLibrary';

export default async function OnCustomEventDataReceived(context) {
    const eventData = context.getAppEventData();
    switch (eventData.EventType) {
        case 'ScanResultEvent': {
            edtSoftInputModeConfig(context);
            const [inPartsList, outPartsList] = await parseScanResult(context, eventData.Data);
            libCom.setStateVariable(context, 'InPartsList', inPartsList);
            libCom.setStateVariable(context, 'OutPartsList', outPartsList);
            context.getPageProxy().setActionBinding(context.binding);
            return context.executeAction('/SAPAssetManager/Actions/Parts/PartsIssueEDTNav.action');
        }
        case 'HardKeyPressedEvent': {
            const isEnabled = await scanAllButtonVisibility(context);
            if (isEnabled) {
                scannerLibrary.triggerScan(context, scannerLibrary.SCAN_MODE_MULTI_SCAN, scannerLibrary.SELECTION_AUTOMATIC);
            }
            break;
        }
        default:
            break;
    }
}

async function parseScanResult(context, scanResult) {
    const components = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', [],
        `$filter=OrderId eq '${context.binding.OrderId}'&$expand=Material,MaterialBatch_Nav`);

    if (components && components.length > 0) {
        const inPartsListSet = new Set();
        const outPartsListSet = new Set();

        scanResult.forEach(data => {
            outPartsListSet.add(data.ScanValue);
        });

        for (let component of components._array) {
            if (outPartsListSet.has(component.MaterialNum)) { 
                outPartsListSet.delete(component.MaterialNum);
                inPartsListSet.add(component.MaterialNum);
            }
        }

        return [Array.from(inPartsListSet), Array.from(outPartsListSet)];
    }

    return Promise.resolve();
}
