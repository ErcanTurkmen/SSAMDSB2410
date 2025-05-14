import CommonLibrary from '../Common/Library/CommonLibrary';
import FilterLibrary from '../Filter/FilterLibrary';
import ExcludeSelectExpandOptions from '../Measurements/ExcludeSelectExpandOptions';
import EquipmentCount from './EquipmentCount';
import EquipEntity from './EquipmentEntitySet';
import EquipmentFilterbyType from './EquipmentFilterByType';

export default function OnEquipmentFilterSuccess(context) {
    let queryOption = CommonLibrary.getQueryOptionFromFilter(context);
    let entitySet = EquipEntity(context);
    let equipmentQuery = EquipmentFilterbyType(context);

    queryOption = combineQueries(queryOption, equipmentQuery);

    return setEquipmentCaptionWithCount(context, entitySet, queryOption);
}

/**
 *
 * @param {*} context
 * @param {*} entitySet
 * @param {*} queryOption
 * @returns
 */
export function setEquipmentCaptionWithCount(context, entitySet, queryOption) {
    const pageName = CommonLibrary.getPageName(context);

    if (pageName === 'EquipmentListViewPage') {
        if (queryOption) {
            queryOption = ExcludeSelectExpandOptions(queryOption);
        }
        let totalCountPromise = EquipmentCount(context);
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);

        return Promise.all([totalCountPromise, countPromise]).then(countsArray => {
            let totalCount = countsArray[0];
            let count = countsArray[1];

            if (count === totalCount) {
                return context.getPageProxy().setCaption(context.localizeText('equipment_x', [totalCount]));
            }
            return context.getPageProxy().setCaption(context.localizeText('equipment_x_x', [count, totalCount]));
        });
    }
    return Promise.resolve('');
}

/**
 *
 * @param {*} queryOption
 * @param {*} equipmentQuery
 * @returns
 */
export function combineQueries(queryOption, equipmentQuery) {
    const combinedFilterTerm = [queryOption, equipmentQuery]
        .map(query => FilterLibrary.TakeFilterTerm(query || ''))
        .filter(term => !!term)
        .map(query => `(${query})`)
        .join(' and ');
    return combinedFilterTerm ? `$filter=${combinedFilterTerm}` : '';
}
