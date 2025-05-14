import PackageItemsFilterCaptionOpen from './PackageItemsFilterCaptionOpen';
import { PACKAGE_ITEMS_OPEN_FILTER } from '../PackageItemsOnLoadQuery';
/**
* This function sets default filter for Voyage List
* @param {IClientAPI} context
*/
export default function GetPackageItemsPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'ItemsOpen', [PackageItemsFilterCaptionOpen(context)],[PACKAGE_ITEMS_OPEN_FILTER], true)];
}
