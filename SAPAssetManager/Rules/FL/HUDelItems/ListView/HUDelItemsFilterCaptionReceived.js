import { HU_DEL_ITEMS_RECEIVED_FILTER } from './HUDelItemsOnLoadQuery';
 
export default function HUDelItemsFilterCaptionReceived(context) {
    let filter = `$filter=(${HU_DEL_ITEMS_RECEIVED_FILTER})`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHuDelItems', filter).then(count => {
        return context.localizeText('fld_packages_received', [count]);
    });
}
