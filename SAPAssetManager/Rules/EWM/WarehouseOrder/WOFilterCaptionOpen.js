import { WO_OPEN_FILTER } from './WarehouseOrderListQueryOptions';

export default function WOFilterCaptionOpen(context) {
      let filter = `$filter=(${WO_OPEN_FILTER})`;
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', filter).then(count => {
            return context.localizeText('open_ewm_items_x', [count]);
      });
}
