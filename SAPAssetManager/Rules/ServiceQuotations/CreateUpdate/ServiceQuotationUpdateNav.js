import CommonLibrary from '../../Common/Library/CommonLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default async function ServiceQuotationUpdateNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');

    const query = '$expand=RefObjects_Nav/Material_Nav,RefObjects_Nav/Equipment_Nav,RefObjects_Nav/FuncLoc_Nav';
    const serviceQuotation = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], query).then(result => result.length ? result.getItem(0) : {});
    const refObjectsValues = S4ServiceLibrary.getRefObjectsIDsFromBinding(serviceQuotation);
    let actionBinding = Object.assign({}, serviceQuotation, refObjectsValues);
    context.getPageProxy().setActionBinding(actionBinding);

    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/ServiceQuotations/CreateUpdate/ServiceQuotationCreateUpdate.page');
    return context.executeAction('/SAPAssetManager/Actions/ServiceQuotation/CreateUpdate/ServiceQuotationsCreateUpdateNav.action');
}
