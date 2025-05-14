import libCom from '../Common/Library/CommonLibrary';

export default function DocumentEditorOriginalResolution(context) {
    const imgSrc =  libCom.getStateVariable(context, 'DocumentEditorOriginalImageSource');
    return imgSrc.width + ' x ' + imgSrc.height + ' ' + context.localizeText('pixels'); 
}
