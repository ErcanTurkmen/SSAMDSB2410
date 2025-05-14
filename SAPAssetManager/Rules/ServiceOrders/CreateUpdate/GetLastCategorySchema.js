import libCommon from '../../Common/Library/CommonLibrary';
import libSOControls from '../S4ServiceOrderControlsLibrary';

export default function GetLastCategorySchema(context) {
    let category1 = libSOControls.getCategory(context, 'Category1LstPkr');
    let category2 = libSOControls.getCategory(context, 'Category2LstPkr');
    let category3 = libSOControls.getCategory(context, 'Category3LstPkr');
    let category4 = libSOControls.getCategory(context, 'Category4LstPkr');

    let lastCategoryValue = [category4, category3, category2, category1].find(el => libCommon.isDefined(el));

    if (libCommon.isDefined(lastCategoryValue)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', [], `$filter=CategoryGuid eq guid'${lastCategoryValue}'`).then(result => {
            if (result && result.length > 0) {
                return result.getItem(0);
            }
            return null;
        });
    }

    return Promise.resolve();
}
