import libCommon from '../../../Common/Library/CommonLibrary';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function CreateFromValueChanged(controlProxy) {
    let pageProxy = controlProxy.getPageProxy();
    let clientData = controlProxy.getClientData();

    let createFromKey = libCommon.getControlValue(libCommon.getControlProxy(pageProxy, 'CreateFromLstPkr'));
    let previousKeySelected = createFromKey === 'PREVIOUSLY_CREATED';

    if (previousKeySelected && libCommon.unsavedChangesPresent(pageProxy)) {
        return pageProxy.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties':
            {
                'Title': '$(L,warning)',
                'Message': '$(L,overwrite_values)',
                'OKCaption': '$(L,ok)',
                'CancelCaption': '$(L,cancel)',
            },
        }).then(actionResult => {
            if (actionResult.data === true) {
                clientData.previousCreatedFromValue = createFromKey;
                return updateRelatedControls(controlProxy, createFromKey);
            } else {
                return controlProxy.setValue(clientData.previousCreatedFromValue, false);
            }
        });
    }

    clientData.previousCreatedFromValue = createFromKey;
    return updateRelatedControls(controlProxy, createFromKey);
}

async function updateRelatedControls(context, createFromKey) {
    let pageProxy = context.getPageProxy();

    let templateKeySelected = false;
    let previousKeySelected = false;

    let categoryPicker = libCommon.getControlProxy(pageProxy, 'CategoryLstPkr');
    let categorySpecifier = categoryPicker.getTargetSpecifier();

    let queryOptions = '';

    switch (createFromKey) {
        case 'TEMPLATE': {
            templateKeySelected = true;
            queryOptions = '$filter=sap.entityexists(EquipTemplate_Nav)';
            break;
        }
        case 'PREVIOUSLY_CREATED': {
            previousKeySelected = true;
            break;
        }
        default: {
            break;
        }
    }

    categorySpecifier.setQueryOptions(queryOptions);
    categoryPicker.setTargetSpecifier(categorySpecifier);

    libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setVisible(true);
    libCommon.getControlProxy(pageProxy, 'TemplateLstPkr').setValue('');
    libCommon.getControlProxy(pageProxy, 'TemplateLstPkr').setVisible(templateKeySelected);
    libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setVisible(previousKeySelected);
    libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(false);
    if (previousKeySelected) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], '$filter=sap.islocal()&$orderby=EquipId').then(async result => {
            if (result.length === 1) {
                libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setValue(result.getItem(0).EquipId);
                libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue(result.getItem(0).EquipCategory);
            } else if (result.length > 0) {
                libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setValue('');
                libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue('');
                await resetTemplatePicker(context);
            }
        });
    } else {
        libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setValue('');
        libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue('');
        await resetTemplatePicker(pageProxy);
    }

    ResetValidationOnInput(context);
    return Promise.resolve();
}

/**
 * Category has been blanked out, so blank out the template picker
 * @param {*} context 
 */
async function resetTemplatePicker(context) {
    let templatePicker = libCommon.getControlProxy(context, 'TemplateLstPkr');
    let templateSpecifier = templatePicker.getTargetSpecifier();
    let queryOptions = '$filter=1 eq 0';

    templateSpecifier.setQueryOptions(queryOptions);
    await templatePicker.setTargetSpecifier(templateSpecifier);
}
