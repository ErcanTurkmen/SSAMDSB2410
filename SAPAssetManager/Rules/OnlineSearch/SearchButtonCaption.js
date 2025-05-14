
import libCom from '../Common/Library/CommonLibrary';
import libSearch from './OnlineSearchLibrary';

/** @param {IPageProxy} context  */
export default function SearchButtonCaption(context) {
    const selectedTab = libSearch.getCurrentTabName(context);
    const criteriaCount = libCom.getStateVariable(context, 'CriteriaCount', libCom.getPageName(context));
    const count = criteriaCount?.[selectedTab] || 0;
    return count > 0 ?
        context.localizeText('search_criteria_online_search_x', [count]) :
        context.localizeText('search_criteria_online_search');
}
