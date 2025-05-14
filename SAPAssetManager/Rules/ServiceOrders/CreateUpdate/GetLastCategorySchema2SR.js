import libCommon from '../../Common/Library/CommonLibrary';
import libSRControls from '../S4ServiceRequestControlsLibrary';

export default function GetLastCategorySchema2SR(context) {
    let category1 = libSRControls.getCategory(context, 'SubjectCategory1LstPkr');
    let category2 = libSRControls.getCategory(context, 'SubjectCategory2LstPkr');
    let category3 = libSRControls.getCategory(context, 'SubjectCategory3LstPkr');
    let category4 = libSRControls.getCategory(context, 'SubjectCategory4LstPkr');

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
