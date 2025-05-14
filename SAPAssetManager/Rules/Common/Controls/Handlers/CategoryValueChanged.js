import libCommon from '../../Library/CommonLibrary';

export default function CategoryValueChanged(context, filteringProperty) {
    let pageProxy = context.getPageProxy();

    let templatePicker = libCommon.getControlProxy(pageProxy, 'TemplateLstPkr');
    templatePicker.setValue('');
    let templateSpecifier = templatePicker.getTargetSpecifier();
    let queryOptions = '';

    let value = libCommon.getControlValue(context);
    if (value) {
        queryOptions = `$filter=${filteringProperty} eq '${value}'`;
    } else {
        queryOptions = '$filter=1 eq 0';
    }

    templateSpecifier.setQueryOptions(queryOptions);
    templatePicker.setTargetSpecifier(templateSpecifier);
}
