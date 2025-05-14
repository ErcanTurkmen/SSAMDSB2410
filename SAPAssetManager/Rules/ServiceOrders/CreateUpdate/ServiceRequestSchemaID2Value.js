import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema2SR from './GetLastCategorySchema2SR';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceRequestSchemaID2Value(context) {
    return GetLastCategorySchema2SR(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.SchemaID;
        }
        let parameterName = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ParameterNames/S4ServiceRequestSubject.global').getValue();
        let catalogType = CommonLibrary.getAppParam(context, 'CATALOGTYPE', parameterName);
        return S4ServiceLibrary.getHeaderCategorySchemaGuid(context, 'SRVR', 'ServiceRequestCategory' + catalogType + 'SchemaGuid', catalogType).then(guid => {
            if (guid) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'CategorizationSchemas', ['SchemaID'], `$filter=CategoryLevel eq '1' and SchemaGuid eq guid'${guid}'`).then(result => {
                    if (result.length) {
                        return result.getItem(0).SchemaID;
                    }
                    return '';
                });
            }
            return '';
        });
    });
}
