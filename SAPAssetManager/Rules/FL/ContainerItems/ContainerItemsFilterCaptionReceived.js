import { CONTAINER_ITEMS_RECEIVED_FILTER } from './ContainerItemsListQueryOptions';
import { appendContainerIDFilter } from '../Common/FLLibrary';

export default function ContainerItemsFilterCaptionReceived(context) {

      const filter = `$filter=${appendContainerIDFilter(`(${CONTAINER_ITEMS_RECEIVED_FILTER})`, context)}`;
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerItems', filter).then(count => {
            return context.localizeText('received_items_x', [count]);
      });
}
