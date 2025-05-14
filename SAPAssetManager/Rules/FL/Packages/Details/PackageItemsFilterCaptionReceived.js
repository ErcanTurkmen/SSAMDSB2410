import { PACKAGE_ITEMS_RECEIVED_FILTER } from '../PackageItemsOnLoadQuery';
import { appendContainerIDFilter } from '../../Common/FLLibrary';

export default function PackageItemsFilterCaptionReceived(context) {
    const filter = `${appendContainerIDFilter(PACKAGE_ITEMS_RECEIVED_FILTER, context)}`;
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPackageItems', filter).then(count => {
          return context.localizeText('fld_packages_received', [count]);
    });
}
