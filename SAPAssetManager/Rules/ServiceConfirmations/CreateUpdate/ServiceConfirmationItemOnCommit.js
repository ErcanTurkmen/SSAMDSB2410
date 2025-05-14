import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import GetServiceItemCategory1 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory1';
import GetServiceItemCategory2 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory2';
import GetServiceItemCategory3 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory3';
import GetServiceItemCategory4 from '../../ServiceItems/CreateUpdate/Data/GetServiceItemCategory4';
import GetServiceItemDuration from '../../ServiceItems/CreateUpdate/Data/GetServiceItemDuration';
import GetServiceItemDurationUOM from '../../ServiceItems/CreateUpdate/Data/GetServiceItemDurationUOM';
import GetServiceItemQunatity from '../../ServiceItems/CreateUpdate/Data/GetServiceItemQunatity';
import GetServiceItemRequstedStartDate from '../../ServiceItems/CreateUpdate/Data/GetServiceItemRequstedStartDate';
import GetConfirmationObjectType from './Data/GetConfirmationObjectType';
import GetServiceConfirmationItemLocalID from './Data/GetServiceConfirmationItemLocalID';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import S4ServiceItemStatusLibrary from '../../ServiceOrders/S4ServiceItemStatusLibrary';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import GetLastCategorySchemaPropertyValue from '../../ServiceItems/CreateUpdate/Data/GetLastCategorySchemaPropertyValue';
import GetServiceConfirmationLocalID from './Data/GetServiceConfirmationLocalID';
import GetServiceConfirmationItemObjectType from './Data/GetServiceConfirmationItemObjectType';
import { showStatusChangeSuccessMessage } from '../../ServiceOrders/Status/ServiceOrderMobileStatusPostUpdate';
import GetAmountValue from '../../Expense/CreateUpdate/Data/GetAmountValue';
import GetServiceOrderServiceProfileValue from './Data/GetServiceOrderServiceProfileValue';
import AnalyticsManager from '../../AnalyticsManager/AnalyticsManagerLibrary';

export default function ServiceConfirmationItemOnCommit(context) {
    CommonLibrary.setStateVariable(context, 'LocalItemId', '');

    return Promise.all([
        GetServiceConfirmationItemLocalID(context),
        GetLastCategorySchemaPropertyValue(context),
        GetServiceConfirmationLocalID(context),
        GetServiceConfirmationItemObjectType(context),
    ]).then(results => {
        let id = results[0];
        let categorySchema = results[1];
        let parentId = results[2];
        let itemType = results[3];

        const isHocConfirmationItem = ServiceConfirmationLibrary.getInstance().getActionPage() === ServiceConfirmationLibrary.itemHocFlag;
        const producIdControlName = isHocConfirmationItem ? 'ProductIdLstPkr' : 'ProductIdProperty';
        const serviceType = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceTypeLstPkr'));
        const valuationType = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ValuationTypeLstPkr'));

        let contractID = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceContractProperty'));
        ServiceConfirmationLibrary.getInstance().storeItemFilledValues({
            'Category1': GetServiceItemCategory1(context),
            'Category2': GetServiceItemCategory2(context),
            'Category3': GetServiceItemCategory3(context),
            'Category4': GetServiceItemCategory4(context),
            'ObjectID': CommonLibrary.IsOnCreate(context) ? parentId : '',
            'ObjectType': CommonLibrary.IsOnCreate(context) ?  GetConfirmationObjectType(context) : '',
            'ItemNo': CommonLibrary.IsOnCreate(context) ?  id : '',
            'ItemObjectType': itemType,
            'ItemDesc': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'DescriptionNote')),
            'StartOfWork': GetServiceItemRequstedStartDate(context),
            'AccountingInd': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'AccountIndicatorLstPkr')),
            'ContractID': contractID === '-' ? '' : contractID,
            'Currency': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'CurrencyLstPkr')),
            'ResponseProfile': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ResponseProfileProperty')),
            'ServiceProfile': GetServiceOrderServiceProfileValue(context),
            'ServiceType': serviceType,
            'ValuationType': valuationType,
            'WarrantyID': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'WarrantyProperty')),
            'ItemCategory': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ItemCategoryLstPkr')),
            'Amount': GetAmountValue(context),
            'ProductID': CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, producIdControlName)),
            'QuantityUOM': GetServiceItemQunatity(context) ? CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'UomSimple')) : '',
            'DurationUOM': GetServiceItemDuration(context) ? GetServiceItemDurationUOM(context) : '',
            'Duration': GetServiceItemDuration(context),
            'Quantity': GetServiceItemQunatity(context),
            'RequestedStart': GetServiceItemRequstedStartDate(context),
            'SchemaID': categorySchema.SchemaID,
            'CategoryID': categorySchema.CategoryID,
            'SubjectProfile': categorySchema.SubjectProfile,
            'CatalogType': categorySchema.CodeCatalog,
            'CodeGroup': categorySchema.CodeGroup,
            'Code': categorySchema.Code,
        });

        if (CommonLibrary.IsOnCreate(context)) {
            let createAction;
            if (ServiceConfirmationLibrary.getInstance().isStartPageIsConfirmationPage() && IsCompleteAction(context)) {
                createAction = context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateChangeSet.action',
                    'Properties': {
                        'Actions': [
                            '/SAPAssetManager/Rules/ServiceConfirmations/CreateUpdate/ServiceConfirmationCreate.js',
                        ],
                    },
                });
            } else if (ServiceConfirmationLibrary.getInstance().isStartPageIsConfirmationPage()) {
                createAction = ServiceConfirmationLibrary.getInstance().createConfirmation(context);
            } else {
                createAction = ServiceConfirmationLibrary.getInstance().createConfirmationItem(context);
            }

            return createAction
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        let action = Promise.resolve();

                        if (!ServiceConfirmationLibrary.getInstance().isStartPageIsConfirmationPage()) {
                            CommonLibrary.setOnCreateUpdateFlag(context, '');
                            action = ServiceConfirmationLibrary.getInstance().setConfirmationItemOpenStatus(context);
                        }

                        return action.then(() => {
                            if (IsCompleteAction(context)) {
                                return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
                            }

                            return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceConfirmationItemSuccessfullyCreateadMessage.action').then(() => {
                                if (ServiceConfirmationLibrary.getInstance().isConfirmFlow()) {
                                    return S4ServiceItemStatusLibrary.executeConfirmAfterConfirmation(context).then(() => {
                                        AnalyticsManager.serviceConfirmationItemCreateSuccess();
                                    });
                                }
                                if (ServiceConfirmationLibrary.getInstance().isHoldFlow()) {
                                    return showStatusChangeSuccessMessage(context).then(() => {
                                        AnalyticsManager.serviceConfirmationItemCreateSuccess();
                                    });
                                }
                                return Promise.resolve().then(() => {
                                    AnalyticsManager.serviceConfirmationItemCreateSuccess();
                                });
                            });
                        });
                    });
                })
                .catch((error) => {
                    if (error && error !== 'canceled') {
                        Logger.error('Create Service Confirmation Item', error);
                        return context.executeAction('/SAPAssetManager/Actions/OData/ODataCreateFailureMessage.action');
                    }
                    return Promise.resolve();
                });
        } else {
            ServiceConfirmationLibrary.getInstance().updateItemFieldValue('ServiceType', serviceType);
            ServiceConfirmationLibrary.getInstance().updateItemFieldValue('ValuationType', valuationType);

            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceConfirmationItemUpdate.action',
                'Properties': {
                    'Properties': ServiceConfirmationLibrary.getInstance().getComponentItemData(),
                },
            }).then((result) => {
                if (IsCompleteAction(context)) {
                    WorkOrderCompletionLibrary.updateStepState(context, 'confirmation_item', {
                        data: result.data,
                        link: JSON.parse(result.data)['@odata.editLink'],
                        value: context.localizeText('done'),
                    });
                    return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
                }
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    CommonLibrary.setOnCreateUpdateFlag(context, '');
                    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceConfirmationItemSuccessfullyUpdatedMessage.action');
                });
            });
        }
    });
}
