import libCommon from '../../Library/CommonLibrary';

export default async function CreateFromValueChanged(control) {
    let pageProxy = control.getPageProxy();

    let templateKeySelected = false;
    let previousKeySelected = false;
    let none = false;
    
    let createFromKey = libCommon.getControlValue(libCommon.getControlProxy(pageProxy, 'CreateFromLstPkr'));
    switch (createFromKey) {
        case 'TEMPLATE': {
            templateKeySelected = true;
            break;
        }
        case 'PREVIOUSLY_CREATED': {
            previousKeySelected = true;
            break;
        }
        default: {
            none = true;
        }
    }

    if (control.getVisible()) {
        libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue('');
        libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setVisible(templateKeySelected || none);
        libCommon.getControlProxy(pageProxy, 'TemplateLstPkr').setValue('');
        libCommon.getControlProxy(pageProxy, 'TemplateLstPkr').setVisible(templateKeySelected);
        libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setValue('');
        libCommon.getControlProxy(pageProxy, 'ReferenceLstPkr').setVisible(previousKeySelected);
        libCommon.getControlProxy(pageProxy, 'LongTextNote').setEditable(true);
        libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue([]);
        libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setVisible(false);
        await resetTemplatePicker(pageProxy);
    }
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
