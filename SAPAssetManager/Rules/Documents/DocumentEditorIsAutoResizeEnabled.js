import libCom from '../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentEditorIsAutoResizeEnabled(context) {
    let maxSize = libCom.getAppParam(context, 'IMAGE_EDITOR', 'MAX_IMAGE_SIZE');
    return (maxSize && maxSize > 0);
}
