import PackagesFilterCaptionOpen  from './PackagesFilterCaptionOpen';
import { PACKAGES_OPEN_FILTER } from './PackagesOnLoadQuery';
/**
* This function sets default filter for Voyage List
* @param {IClientAPI} context
*/
export default function GetPackagesPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'Open', [PackagesFilterCaptionOpen(context)],[PACKAGES_OPEN_FILTER], true)];
}
