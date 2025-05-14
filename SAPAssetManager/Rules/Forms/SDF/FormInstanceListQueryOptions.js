import CommonLibrary from '../../Common/Library/CommonLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
/**
 * 
 * @param {IClientAPI} clientAPI 
 * @param {boolean} countOnly set to true to remove the $top and $select for use in $count
 * @returns {string}
 */
export default function FormInstanceListQueryOptions(clientAPI, countOnly = false, checkMandatory = false) {
    const pageName = CommonLibrary.getPageName(clientAPI);

    const queryBuilder = new QueryBuilder(
        ['DynamicFormInstance_Nav/FormInstanceID ne null'], // filters
        ['DynamicFormInstance_Nav'], // expands
        [
            'AppName',
            'FormName',
            'FormVersion',
            'FormInstanceID',
            'DynamicFormInstance_Nav/FormStatus',
            'DynamicFormInstance_Nav/Mandatory',
            'ObjectType',
            'ObjectKey',
            'TechnicalEntityKey',
            'TechnicalEntityType',
        ], // selects
        [], // extras
    );

    // for sections
    if (pageName !== 'FormListViewPage' && !countOnly) {
        queryBuilder.addExtra('top=2');
    }

    // for mandatory flag
    if (clientAPI.getPageProxy().currentPage.id === 'CompleteOrderScreen' || checkMandatory) {
        queryBuilder.addFilter('DynamicFormInstance_Nav/Mandatory eq \'X\'');
        queryBuilder.addFilter('DynamicFormInstance_Nav/FormStatus ne \'Completed\'');
        queryBuilder.addFilter('DynamicFormInstance_Nav/FormStatus ne \'Final\'');
    }

    if (countOnly) {
        queryBuilder.selects.length = 0;
    }

    return queryBuilder.build();
}
