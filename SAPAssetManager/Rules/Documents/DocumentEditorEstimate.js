import libCom from '../Common/Library/CommonLibrary';
import imageViewPath from './DocumentEditorImageViewPath';
import imageViewLib from '../../Extensions/ImageViewModule/ImageViewLibrary';

export default function DocumentEditorEstimate(context) {
    const imgSrc =  libCom.getStateVariable(context, 'DocumentEditorOriginalImageSource');
    const page = context.evaluateTargetPathForAPI('#Page:DocumentEditorResizePage');
    const sliderExt = page.getControls()[0].getSections()[0].getExtension();
    const percent = sliderExt ? sliderExt.getValue() : context.getGlobalDefinition('/SAPAssetManager/Globals/Documents/DocumentEditorImageResizeDefaultPercent.global').getValue();
    const newImg = imgSrc.resize(Math.max(imgSrc.width, imgSrc.height) * (percent / 100.0), true);
    libCom.setStateVariable(context, 'DocumentEditorEstimatedImageSource', newImg);

    page.getControls()[0].getSections()[2].redraw();
    // reload image
    const imageViewExt = page.getControls()[0].getSections()[1].getExtension();
    imageViewLib.loadImageView(imageViewExt, imageViewPath(context));
}
