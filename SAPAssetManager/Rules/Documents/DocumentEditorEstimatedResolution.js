import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorEstimatedResolution(context) {
    const newImg = libCom.getStateVariable(context, 'DocumentEditorEstimatedImageSource');
    if (newImg) {
        return newImg.width + ' x ' + newImg.height + ' ' + context.localizeText('pixels');
    }
    return context.localizeText('error');
}
