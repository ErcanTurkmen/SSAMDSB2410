import libCommon from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';

export default function EquipmentListViewQueryOptions(context) {
    const equipmentTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/EquipmentTab.global').getValue();
    const queryOptions = libCommon.getQueryOptionFromFilter(context);
    const promise = libCommon.isDefined(queryOptions) ?
        libSearch.setTabCaptionWithCountAndEnableSelect(context.getPageProxy(), 'Equipments', queryOptions, equipmentTabName, 'equipment') :
        Promise.resolve();

    return promise.then(() => {
        return '';
    });
}
