
export default function DefaultOrderByEquipmentId(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Sorter, 'EquipId', undefined, ['EquipId'], false, context.localizeText('sort_filter_prefix'), [context.localizeText('equipment_id')])];
}
