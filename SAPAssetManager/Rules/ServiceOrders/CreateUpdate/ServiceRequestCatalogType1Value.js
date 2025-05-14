import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema1SR from './GetLastCategorySchema1SR';

export default function ServiceRequestCatalogType1Value(context) {
    return GetLastCategorySchema1SR(context).then(schema => {
        let parameterName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/S4ServiceRequestReason.global').getValue();
        let defaultType = CommonLibrary.getAppParam(context, 'CATALOGTYPE', parameterName);
        if (CommonLibrary.isDefined(schema)) {
            return schema.CodeCatalog || defaultType;
        }
        return defaultType;
    });
}
