import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function ItemCategoryQueryOptions(context) {
    let link = '';
    let productId = context.binding ? context.binding.ProductID : '';
    let productControl = CommonLibrary.getControlProxy(context.getPageProxy(), 'ProductIdProperty') || CommonLibrary.getControlProxy(context.getPageProxy(), 'ProductIdLstPkr');

    if (productControl && !productId) {
        productId = CommonLibrary.getControlValue(productControl);
    }

    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let previousPageName = '';
    if (previousPage) {
        previousPageName = CommonLibrary.getPageName(previousPage);
    }
    let pageName = CommonLibrary.getPageName(context);
    let readType;
    if (pageName === 'CreateUpdateServiceItemScreen') {
        if (context.binding) {
            if (context.binding.S4ServiceOrder_Nav) {
                link = context.binding.S4ServiceOrder_Nav['@odata.readLink'];
            } else if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
                link = context.binding['@odata.readLink'];
            }
        }
        readType = ServiceConfirmationLibrary.getOrderProcessType(context, link);
    } else if (pageName === 'CreateUpdateServiceQuotationItem') {
        link = context?.binding?.S4ServiceQuotation_Nav?.['@odata.readLink'];
        readType = ServiceConfirmationLibrary.getQuotationProcessType(context, link);
    } else {
        if (context.binding) {
            if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation') {
                link = context.binding['@odata.readLink'];
            } else if (context.binding.S4ServiceConfirmation_Nav) {
                link = context.binding.S4ServiceConfirmation_Nav['@odata.readLink'];
            }
        }

        readType = ServiceConfirmationLibrary.getConfirmationProcessType(context, link);
    }

    return readType.then(type => {
        let options = `$orderby=ItemCategory&$filter=TransactionType eq '${type}'`;

        if (pageName === 'CreateUpdateServiceItemScreen' || pageName === 'CreateUpdateServiceQuotationItem') {
            let categories = [
                S4ServiceLibrary.getServiceProductItemCategories(context), 
                S4ServiceLibrary.getServiceProductExpenseCategories(context),
                S4ServiceLibrary.getServiceProductPartCategories(context),
            ];
            categories = categories.flat();  

            const filterCriterias = S4ServiceLibrary.getServiceItemsFilterCriterias(context);
            if (filterCriterias && filterCriterias.length && previousPageName === 'ServiceItemsListViewPage') {
                let filter = filterCriterias[0].filterItems[0];
                options += ' and (' + filter + ')';
            } else if (categories.length) {
                categories = categories.map(category => {
                    return `ObjectType eq '${category}'`;
                });
                options += ' and (' + categories.join(' or ') + ')';
            }
        }

        if (productId) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `Materials('${productId}')`, [], '$select=ItemCatGroup').then(result => {
                let itemCatGroup = result.length ? result.getItem(0).ItemCatGroup : '';

                if (itemCatGroup) {
                    options += ` and ItemCatGroup eq '${itemCatGroup}'`;
                }

                return options;
            });
        }

        return options;
    }).catch((error) => {
        Logger.error('Failed to read  ItemCategoryQueryOptions', error);
        return '$filter=false';
    });
}
