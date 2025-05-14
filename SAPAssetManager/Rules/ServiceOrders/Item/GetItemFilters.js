import { S4ServiceItemFastFilters } from '../../FastFilters/S4FSMFastFilters/S4ServiceItemFastFilters';
import Logger from '../../Log/Logger';
import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';
import GetItemTypePickerItems from './Filter/GetItemTypePickerItems';

/**
 * @typedef ServiceItemListPageClientData
 * @prop {S4ServiceItemFastFilters} ServiceItemFastFilters
 */
export default function GetItemFilters(context) {
    return GetItemTypePickerItems(context)
        .then(async pickerItems => {
            const serviceItemFastFilters = new S4ServiceItemFastFilters(context, pickerItems);

            context.getPageProxy().getClientData().ServiceItemFastFilters = serviceItemFastFilters;

            const errorsFilterQuery = await buildErrorsFilterQuery(context);
            serviceItemFastFilters.setConfigProperty('errors_filter_query', errorsFilterQuery);

            return serviceItemFastFilters.getFastFilterItemsForListPage(context);
        });
}

function buildErrorsFilterQuery(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceErrorMessages', ['Message', 'ItemNo', 'ObjectID'], '$filter=ItemNo ne \'\'&$orderby=ObjectID')
        .then(errors => {
            const queries = [];
            const uniqueErrors = new Set();
            
            errors.forEach(error => {
                const uniqueQuery = `(ItemNo eq '${error.ItemNo}' and ObjectID eq '${error.ObjectID}')`;
                if (!uniqueErrors.has(uniqueQuery) && S4ErrorsLibrary.isMessageAssociatedWithItem(error.Message, error.ItemNo)) {
                    uniqueErrors.add(uniqueQuery);
                    queries.push(uniqueQuery);
                }
            });
            
            return queries.join(' or ');
        })
        .catch(error =>{
            Logger.error('buildErrorsFilterQuery', error);
            return Promise.resolve('false');
        });
}
