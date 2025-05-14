import { CONTAINER_ITEMS_OPEN_FILTER } from './ContainerItemsListQueryOptions';
import { appendContainerIDFilter } from '../Common/FLLibrary';

export default function ContainerItemsFilterCaptionOpen(context) {

      const filter = `$filter=${appendContainerIDFilter(`(${CONTAINER_ITEMS_OPEN_FILTER})`, context)}`;
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerItems', filter).then(count => {
            return context.localizeText('open_x', [count]);
      });
}

