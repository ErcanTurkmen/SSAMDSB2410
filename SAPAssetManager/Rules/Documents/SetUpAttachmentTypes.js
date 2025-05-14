import ValidationLibrary from '../Common/Library/ValidationLibrary';
import CommonLibrary from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';

export default function SetUpAttachmentTypes(context) {
    try {
        let attachmentControl = context.evaluateTargetPathForAPI('#Control:Attachment');

        if (attachmentControl) {
            let types = retrieveAttachmentTypes(context);
            attachmentControl.setAllowedFileTypes(types);
            let actions = getAttachmentActionTypes(types);
            attachmentControl.setAttachmentActionType(actions);
        }
    } catch (error) {
        Logger.error('SetUpAttachmentTypes', error);
    }
}

function retrieveAttachmentTypes(context) {
    let types = CommonLibrary.getAppParam(context, 'ATTACHMENTS', 'UploadFileTypes');
    let arrayOfTypes;
    if (!ValidationLibrary.evalIsEmpty(types) && typeof types === 'string') {
        Logger.info('ATTACHMENT TYPES', 'The types were retrieved: ' + types);
        // from 'txt, application/msword, .png, ' to ['txt', 'png']
        arrayOfTypes = types.split(',')
            .filter((type) => {
                return !!type.trim() && !type.includes('/');
            }).map((type) => {
                return type.trim().replace('.', '');
            });
    } else {
        arrayOfTypes = [];
        Logger.info('ATTACHMENT TYPES', 'The types were not retrieved, the default value is used.');
    }

    return arrayOfTypes;
}

function getAttachmentActionTypes(types) {
    const defaultActions = ['AddPhoto', 'TakePhoto', 'SelectFile'];

    if (!types || types.length === 0) {
        return defaultActions;
    }

    let actions = ['SelectFile'];

    const imageReg = /(gif|jpg|jpeg|tiff|png|bmp|heic|heif|hevc|tiff|mp4|mov|avi)$/i;
    let imageType = types.findIndex((type) => {
        return imageReg.test(type);
    });
    if (imageType !== -1) {
        actions.push('AddPhoto');
        actions.push('TakePhoto');
    }

    return actions;
}
