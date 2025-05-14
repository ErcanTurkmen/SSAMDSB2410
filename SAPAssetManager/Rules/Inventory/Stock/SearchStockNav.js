/**
* Describe this function...
* @param {IClientAPI} context
*/

export default function SearchStockNav(context) {
    context.setActionBarItemVisible('search_offline', false);
    context.setActionBarItemVisible('search_online', true);
    context.setActionBarItemVisible('FilterButton', true);
    context.getClientData().StockOnLineSearch = false;
    const stocksListOfflineSection = context.getControls()[0].getSections()[0];
    const stocksListOnlineSection = context.getControls()[0].getSections()[1];
    return stocksListOfflineSection.setVisible(true)
        .then(() => stocksListOnlineSection.setVisible(false));
}
