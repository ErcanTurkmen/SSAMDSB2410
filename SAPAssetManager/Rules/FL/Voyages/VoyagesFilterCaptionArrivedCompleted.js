import { VOYAGES_ARRIVED_COMPLETED_FILTER } from './VoyagesOnLoadQuery';

export default function VoyagesFilterCaptionArrivedCompleted(context) {
    
    let filter = `$filter=(${VOYAGES_ARRIVED_COMPLETED_FILTER})`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', filter).then(count => {
          return context.localizeText('fld_voyages_arrived_completed', [count]);
    });
}
