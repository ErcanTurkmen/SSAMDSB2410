import ValidationLibrary from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

/**
* Inserts template text into Notes field
* @param {IClientAPI} context
*/

export default function InsertTemplate(context) {
    try {
        const control = context.getPageProxy().evaluateTargetPath('#Control:LongTextNote');
        if (control?.getValue()?.length) {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                'Properties': {
                    'Title': context.localizeText('warning'),
                    'Message': context.localizeText('overwrite_note'),
                    'OKCaption': context.localizeText('ok'),
                    'CancelCaption': context.localizeText('cancel'),
                },
            }).then(actionResult => actionResult?.data && _insertTemplateIntoControl(context, control));
        } else {
            return _insertTemplateIntoControl(context, control);
        }
    } catch (err) {
        Logger.error('InsertTemplate', err);
    }
    return false;
}

async function _insertTemplateIntoControl(context, control) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'LongTextTemplates', [], '$top=1').then(template => {
        if (!ValidationLibrary.evalIsEmpty(template) && template.getItem(0)) {
            control.setValue(template.getItem(0).TextString);
        } 
    });
}
