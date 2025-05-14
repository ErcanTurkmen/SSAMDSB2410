/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockFilterIsVisible(context) {
    return !context.getClientData().StockOnLineSearch;
}
