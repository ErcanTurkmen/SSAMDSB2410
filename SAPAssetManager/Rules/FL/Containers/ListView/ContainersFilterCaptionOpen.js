import { CONTAINERS_OPEN_FILTER } from './ContainersListQueryOptions';
import { appendVoyageNumberForContainerFilter } from '../../Common/FLLibrary';

export default function ContainersFilterCaptionOpen(context) {
    
        let baseFilter = `(${CONTAINERS_OPEN_FILTER})`;
        baseFilter = appendVoyageNumberForContainerFilter(baseFilter, context);
        let filter = `$filter=${baseFilter}`;
        
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainers', filter).then(count => {
            return context.localizeText('open_x', [count]);
      });
}
