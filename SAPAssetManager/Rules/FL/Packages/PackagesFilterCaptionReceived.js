import { PACKAGES_RECEIVED_FILTER } from './PackagesOnLoadQuery';
import { appendVoyageNumberForPackagesFilter, appendParentContainerIDFilter } from '../Common/FLLibrary';

export default function PackagesFilterCaptionReceived(context) {

    let baseFilter = `(${PACKAGES_RECEIVED_FILTER})`;
    if (context.binding?.ContainerID) {
           baseFilter = appendParentContainerIDFilter(baseFilter, context);
       } else {
           baseFilter = appendVoyageNumberForPackagesFilter(baseFilter, context);
       }
    let filter = `$filter=${baseFilter}`;
        
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackages', filter).then(count => {
          return context.localizeText('fld_packages_received', [count]);
    });
}
