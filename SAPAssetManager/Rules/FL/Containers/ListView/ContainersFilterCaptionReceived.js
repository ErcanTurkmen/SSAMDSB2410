import { CONTAINERS_RECEIVED_FILTER } from './ContainersListQueryOptions';
import { appendVoyageNumberForContainerFilter } from '../../Common/FLLibrary';

export default function ContainersFilterCaptionReceived(context) {

      let baseFilter = `(${CONTAINERS_RECEIVED_FILTER})`;
      baseFilter = appendVoyageNumberForContainerFilter(baseFilter, context);
      let filter = `$filter=${baseFilter}`;

      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainers', filter).then(count => {
            return context.localizeText('received_items_x', [count]);
      });
}
