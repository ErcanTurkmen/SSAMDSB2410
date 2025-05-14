import libCommon from '../../Common/Library/CommonLibrary';
import libSearch from '../OnlineSearchLibrary';

export default function FuncLocListViewQueryOptions(context) {
    const funcLocTabName = context.getGlobalDefinition('/SAPAssetManager/Globals/OnlineSearch/FuncLocTab.global').getValue();
    const queryOptions = libCommon.getQueryOptionFromFilter(context);
    const promise = libCommon.isDefined(queryOptions) ?
        libSearch.setTabCaptionWithCountAndEnableSelect(context.getPageProxy(), 'FunctionalLocations', queryOptions, funcLocTabName, 'functional_location') :
        Promise.resolve();

    return promise.then(() => {
        return '';
    });
}
