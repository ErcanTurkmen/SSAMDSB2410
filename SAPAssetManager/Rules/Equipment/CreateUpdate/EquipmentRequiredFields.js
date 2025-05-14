import libCommon from '../../Common/Library/CommonLibrary';
import DocumentFieldsAddRequired from '../../Documents/Create/DocumentFieldsAddRequired';

export default function EquipmentRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'MaintenacePlantLstPkr',
    ];

    if (libCommon.IsOnCreate(context)) {
        requiredFields.push('CreateFromLstPkr');
    }

    DocumentFieldsAddRequired(context, requiredFields);

    if (libCommon.IsOnCreate(context) || libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
        const createFrom = libCommon.getControlValue(libCommon.getControlProxy(context, 'CreateFromLstPkr'));
        const reference = libCommon.getControlValue(libCommon.getControlProxy(context, 'ReferenceLstPkr'));
        const template = libCommon.getControlValue(libCommon.getControlProxy(context, 'TemplateLstPkr'));
        const templateVisible = libCommon.getControlProxy(context, 'TemplateLstPkr').getVisible();
        if (createFrom === 'PREVIOUSLY_CREATED' && !reference) {
            requiredFields.push('ReferenceLstPkr');
        } else if (createFrom === 'TEMPLATE' && !template && templateVisible) {
            requiredFields.push('TemplateLstPkr');
        } else {
            requiredFields.push('CategoryLstPkr');
        }
    }

    return requiredFields;
}
