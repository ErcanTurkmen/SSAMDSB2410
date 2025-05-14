import { PACKAGES_OPEN_FILTER } from './PackagesOnLoadQuery';
import { appendVoyageNumberForPackagesFilter, appendParentContainerIDFilter } from '../Common/FLLibrary';

export default function PackagesFilterCaptionOpen(context) {

    let baseFilter = `(${PACKAGES_OPEN_FILTER})`;
       if (context.binding?.ContainerID) {
           baseFilter = appendParentContainerIDFilter(baseFilter, context);
       } else {
           baseFilter = appendVoyageNumberForPackagesFilter(baseFilter, context);
       }
    let filter = `$filter=${baseFilter}`;
    
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackages', filter).then(count => {
          return context.localizeText('fld_packages_open', [count]);
    });
}
