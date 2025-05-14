import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import ServiceOrderItemBatchCreate from '../../ServiceOrders/ServiceItems/CreateUpdate/ServiceOrderItemBatchCreate';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import GetServiceItemObjectType from './Data/GetServiceItemObjectType';
import GetServiceItemQunatity from './Data/GetServiceItemQunatity';
import GetServiceItemDuration from './Data/GetServiceItemDuration';
import GetServiceItemLocalID from './Data/GetServiceItemLocalID';
import GetServiceItemCategory1 from './Data/GetServiceItemCategory1';
import GetServiceItemCategory2 from './Data/GetServiceItemCategory2';
import GetServiceItemCategory3 from './Data/GetServiceItemCategory3';
import GetServiceItemCategory4 from './Data/GetServiceItemCategory4';
import GetServiceItemDurationUOM from './Data/GetServiceItemDurationUOM';
import GetServiceItemRequstedStartDate from './Data/GetServiceItemRequstedStartDate';
import ServiceOrderObjectType from '../../ServiceOrders/ServiceOrderObjectType';
import GetLastCategorySchemaPropertyValue from './Data/GetLastCategorySchemaPropertyValue';
import GetOrderObjectID from './Data/GetOrderObjectID';
import GetAmountValue from '../../Expense/CreateUpdate/Data/GetAmountValue';

export default function ServiceItemOnCommit(context) {
    return Promise.all([GetServiceItemLocalID(context), GetLastCategorySchemaPropertyValue(context), GetServiceItemObjectType(context), GetOrderObjectID(context)]).then(results => {
        let itemId = results[0];
        let categorySchema = results[1];
        let itemType = results[2];
        let orderId = results[3];

        const parentItemNo = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ParentItemLstPkr')).padStart(10, 0);
        let properties = S4ServiceLibrary.removeEmptyProperties({
            'ItemNo': itemId,
            'ItemObjectType': itemType,
            'ItemDesc': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'DescriptionNote')),
            'ObjectID': orderId,
            'ValuationType': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ValuationTypeLstPkr')),
            'AccountingInd': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'AccountIndicatorLstPkr')),
            'ProductID': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ProductIdLstPkr')),
            'ItemCategory': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ItemCategoryLstPkr')),
            'ContractID': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceContractLstPkr')),
            'Category1': GetServiceItemCategory1(context),
            'Category2': GetServiceItemCategory2(context),
            'Category3': GetServiceItemCategory3(context),
            'Category4': GetServiceItemCategory4(context),
            'RequestedStart': GetServiceItemRequstedStartDate(context),
            'Currency': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'CurrencyLstPkr')),
            'Amount': GetAmountValue(context).toString(),
            'ObjectType': ServiceOrderObjectType(context),
            'ServiceType': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceTypeLstPkr')),
            'SchemaID': categorySchema.SchemaID,
            'CategoryID': categorySchema.CategoryID,
            'SubjectProfile': categorySchema.SubjectProfile,
            'CatalogType': categorySchema.CodeCatalog,
            'CodeGroup': categorySchema.CodeGroup,
            'Code': categorySchema.Code,
            'HigherLvlItem': parentItemNo,
        });

        properties.DurationUOM = GetServiceItemDurationUOM(context);
        properties.Duration = GetServiceItemDuration(context);
        properties.QuantityUOM = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'UomSimple'));
        properties.Quantity = GetServiceItemQunatity(context);

        if (CommonLibrary.IsOnCreate(context)) {
            return ServiceOrderItemBatchCreate(context, properties);
        } else {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/ServiceItems/ServiceItemUpdate.action',
                'Properties': {
                    'Properties': properties,
                },
            }).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceItems/ServiceItemUpdateSuccessMessage.action');
                });
            });
        }
    }).catch((error) => {
        Logger.error('Service Item Create/Update', error);
        return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
    });
}
