import personalLib from '../../Persona/PersonaLibrary';
import refreshAllTabsOverviewPage from './RefreshAllTabsOverviewPage';
/**
* Refresh of all tabs on IM persona Overview page
* @param {IClientAPI} context
*/
export default function CallRefreshAfterSync(context) {
    if (personalLib.isInventoryClerk(context)) {
        let page = context.currentPage;
        if (page) {
            if (page.definition.name === 'InventoryOverview') {
                refreshAllTabsOverviewPage(context);
            } else {
                refreshInventoryOverviewPage(context, page);
            }
        }
    }
    return Promise.resolve(true);
}

function refreshInventoryOverviewPage(context, page) {
    let parent = page.parent;
    if (parent && parent.definition.name && parent.definition.name.length) {
        if (parent.definition.name.split('_')[0] === 'InventoryOverview') {
            refreshAllTabsOverviewPage(context);
        }
    } 
}
