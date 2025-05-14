import Logger from '../../../Log/Logger';

/**
* Display 'Done' button once cell value is changed
* @param {IClientAPI} context
*/
export default function ServiceItemsEDTCellOnValueChange(context) {
    try {
        const pageProxy = context.currentPage.context.clientAPI;
        pageProxy.setActionBarItemVisible('Done', true);
    } catch (error) {
        Logger.error('ServiceItemsEDTCellOnValueChange', error);
    }
}
