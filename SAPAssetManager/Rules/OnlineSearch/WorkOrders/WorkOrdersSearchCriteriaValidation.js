import libSearch from '../OnlineSearchLibrary';

/**
* Validates simple properties' max value length
* @param {IClientAPI} context
*/
export default function WorkOrdersSearchCriteriaValidation(context) {
    return libSearch.simplePropertySearchCriteriaValidation(context).then((valid) => {
        if (valid) {
            return libSearch.saveSearchCriteriaToClientData(context, 'OnlineSearchWorkOrdersList').then(() => {
                return libSearch.triggerOnlineSearch(context);
            });
        }
        return null;
    });
}
