import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetCategoryByProperties from '../../ServiceOrders/Details/GetCategoryByProperties';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';

export default async function CreateUpdateServiceItemPageLoaded(context) {
    SetUpAttachmentTypes(context);
    resetServiceItemFieldsOnCreateFromItem(context);
    await updateCategorizationControlsOnEdit(context);
    enableTimeUnitControlOnEdit(context);
    CommonLibrary.saveInitialValues(context);
    return Promise.resolve();
}

export function resetServiceItemFieldsOnCreateFromItem(context) {
    const binding = context.binding || {};

    if (CommonLibrary.IsOnCreate(context) && (binding['@odata.type'] === '#sap_mobile.S4ServiceItem' || binding['@odata.type'] === '#sap_mobile.S4ServiceQuotationItem')) {
        const fieldsToReset = ['DescriptionNote', 'ServiceTypeLstPkr', 'ValuationTypeLstPkr', 'AccountIndicatorLstPkr', 'ProductIdLstPkr',
            'ItemCategoryLstPkr', 'ServiceContractLstPkr', 'Category1LstPkr', 'Category2LstPkr', 'Category3LstPkr', 'Category4LstPkr',
            'TimeUnitLstPkr', 'PlannedDurationSimple', 'QuantitySimple', 'CurrencyLstPkr', 'AmountProperty'];

        fieldsToReset.forEach(filed => {
            CommonLibrary.getControlProxy(context, filed).setValue('');
        });
    }
}

export async function updateCategorizationControlsOnEdit(context) {
    const binding = context.binding || {};

    if (!CommonLibrary.IsOnCreate(context) && binding.SchemaID && binding.CategoryID) {
        const category = await GetCategoryByProperties(context, undefined, binding.SchemaID, binding.CategoryID);

        if (category.CategoryLevel) {
            let categoryControl;

            switch (category.CategoryLevel.trim()) {
                case '1':
                    categoryControl = CommonLibrary.getControlProxy(context, 'Category1LstPkr');
                    break;
                case '2':
                    categoryControl = CommonLibrary.getControlProxy(context, 'Category2LstPkr');
                    break;
                case '3':
                    categoryControl = CommonLibrary.getControlProxy(context, 'Category3LstPkr');
                    break;
                case '4':
                    categoryControl = CommonLibrary.getControlProxy(context, 'Category4LstPkr');
                    break;
                default:
                    break;
            }

            if (categoryControl) {
                categoryControl.setValue(category.CategoryGuid, true);
            }
        } 
    }

    return Promise.resolve();
}

export function enableTimeUnitControlOnEdit(context) {
    if (!CommonLibrary.IsOnCreate(context) && context.binding?.Duration) {
        const timeUnitControl = CommonLibrary.getControlProxy(context, 'TimeUnitLstPkr');
        timeUnitControl.setEditable(true);
    }
}
