import { WO_CONFIRMED_FILTER } from './WarehouseOrderListQueryOptions';

export default function WOFilterCaptionConfirmed(context) {
      let filter = `$filter=(${WO_CONFIRMED_FILTER})`;
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', filter).then(count => {    
          return context.localizeText('confirmed_ewm_items_x', [count]);
       });
 }
 
