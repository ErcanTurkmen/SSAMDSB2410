import { VOYAGES_INTRANSIT_FILTER } from './VoyagesOnLoadQuery';

export default function VoyagesFilterCaptionInTransit(context) {

    let filter = `$filter=(${VOYAGES_INTRANSIT_FILTER})`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyages', filter).then(count => {
          return context.localizeText('fld_voyages_in_transit', [count]);
    });
}
