import GetLastCategorySchemaPropertyValue from '../../../ServiceItems/CreateUpdate/Data/GetLastCategorySchemaPropertyValue';
import GetServiceItemCategory1 from '../../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory1';
import GetServiceItemCategory2 from '../../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory2';
import GetServiceItemCategory3 from '../../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory3';
import GetServiceItemCategory4 from '../../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory4';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default async function OnCreateServiceQuotationItem(context) {
    const categoryProperties = await _collectCategoriesValues(context);
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemCreate.action',
        'Properties': {
            'Properties': categoryProperties,
        },
    });
}

export async function OnUpdateServiceQuotationItem(context) {
    const categoryProperties = await _collectCategoriesValues(context);
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemUpdate.action',
        'Properties': {
            'Properties': categoryProperties,
        },
    });
}

async function _collectCategoriesValues(context) {
    const categorySchemaData = await GetLastCategorySchemaPropertyValue(context);
    const categoryProperties = S4ServiceLibrary.removeEmptyProperties({
        'Category1': GetServiceItemCategory1(context),
        'Category2': GetServiceItemCategory2(context),
        'Category3': GetServiceItemCategory3(context),
        'Category4': GetServiceItemCategory4(context),
        'SchemaID': categorySchemaData.SchemaID,
        'CategoryID': categorySchemaData.CategoryID,
        'SubjectProfile': categorySchemaData.SubjectProfile,
        'CatalogType': categorySchemaData.CodeCatalog,
        'CodeGroup': categorySchemaData.CodeGroup,
        'Code': categorySchemaData.Code,
    });
    return categoryProperties;
}
