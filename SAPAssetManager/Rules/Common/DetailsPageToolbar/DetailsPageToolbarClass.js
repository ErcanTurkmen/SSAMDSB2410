import common from '../Library/CommonLibrary';
import StatusUIGenerator from '../../MobileStatus/StatusUIGenerator';

export default class DetailsPageToolbarClass {
    constructor() {
        this._instance = null;
        this._toolbarItems = {};
    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    static resetToolbarItems(context) {
       delete this._instance._toolbarItems[common.getPageName(context)];
       if (Object.keys(this._instance._toolbarItems).length === 0) {
            this._instance = null;
        }
    }

    getToolbarItems(context) {
        return this._toolbarItems[common.getPageName(context)] || [];
    }

    saveToolbarItems(context, items, detailsPageName = common.getPageName(context)) {
        if (!common.isDefined(items)) {
            this._toolbarItems[detailsPageName] = [];
            return Promise.resolve();
        }

        StatusUIGenerator.orderItemsByTransitionType(items);
        this._toolbarItems[detailsPageName] = items;
        return Promise.resolve();
    }
}
