import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema2SR from './GetLastCategorySchema2SR';

export default function ServiceRequestCatalogType2Value(context) {
    return GetLastCategorySchema2SR(context).then(schema => {
        let parameterName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/S4ServiceRequestSubject.global').getValue();
        let defaultType = CommonLibrary.getAppParam(context, 'CATALOGTYPE', parameterName);
        if (CommonLibrary.isDefined(schema)) { 
            return schema.CodeCatalog || defaultType;
        }
        return defaultType;
    });
}
