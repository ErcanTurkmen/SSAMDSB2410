import { HU_DEL_ITEMS_OPEN_FILTER } from './HUDelItemsOnLoadQuery';
 
export default function HUDelItemsFilterCaptionOpen(context) {
    let filter = `$filter=(${HU_DEL_ITEMS_OPEN_FILTER})`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHuDelItems', filter).then(count => {
        return context.localizeText('fld_packages_open', [count]);
    });
}
