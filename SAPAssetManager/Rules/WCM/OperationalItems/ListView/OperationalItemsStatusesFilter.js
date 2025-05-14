import { OpItemMobileStatusPreFilters } from './OperationalItemsListViewQueryOptions';

/** @param {IPageProxy & {binding: import('./OperationalItemsListFilterNav').OperationalItemsListFilterBinding}} context  */
export default function OperationalItemsStatusesFilter(context) {
    const allowedStatuses = new Set(OpItemMobileStatusPreFilters(context)[context.binding.selectedTab]);
    return GetMobileStatusFilterItemsByObjectType(context, 'WCMDOCITEM', allowedStatuses);
}

/**
 * @param {Set<string>} allowedStatuses
 * @param {string} objectType
 * @param {IClientAPI} context
 */
export function GetMobileStatusFilterItemsByObjectType(context, objectType, allowedStatuses, notAllowedStatuses) {
    return GetMobileStatusCfgsByObjectType(context, objectType, allowedStatuses, notAllowedStatuses)
        .then(mobStatCfg => [...new Map(mobStatCfg.map(cfg => [cfg.MobileStatus, cfg])).values()]  // make the statuses unique
            .map((/** @type {EAMOverallStatusConfig} */ uniqueCfgs) => ({
                ReturnValue: uniqueCfgs.MobileStatus,
                DisplayValue: context.localizeText(uniqueCfgs.TransitionTextKey),
            })));
}

function GetMobileStatusCfgsByObjectType(context, objectType, allowedStatuses = [], notAllowedStatuses = []) {
    const allowedStatusesString = [...allowedStatuses].map(status => `MobileStatus eq '${status}'`).join(' or ');
    const notAllowedStatusesString = [...notAllowedStatuses].map(status => `MobileStatus ne '${status}'`).join(' and ');
    const filterTerms = [`ObjectType eq '${objectType}'`, allowedStatusesString, notAllowedStatusesString]
        .filter(i => !!i)
        .map(i => `(${i})`)
        .join(' and ');
    const filter = `$filter=${filterTerms}`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], filter);
}
